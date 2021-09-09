import config from 'common/config';
import { Inventory } from './inventory';
import request from 'request-promise-native';
import { isDevMode } from 'common/utils/common';
import _ from 'lodash';
import { Logger } from '../../../common/logger';

const log = new Logger('InventoryService');

export const INVENTORY_API_ENDPOINT = `${config.airtableBaseUrl}Inventory${
	isDevMode() ? 'Dev' : ''
}`;

export const dataEndpoints = {
	exchanges: `${config.airtableBaseUrl}Exchanges${isDevMode() ? 'Dev' : ''}`,
	incorporations: `${config.airtableBaseUrl}Incorporations${isDevMode() ? 'Dev' : ''}`,
	banking: `${config.airtableBaseUrl}Banking${isDevMode() ? 'Dev' : ''}`,
	notaries: `${config.airtableBaseUrl}Notaries${isDevMode() ? 'Dev' : ''}`,
	loans: `${config.airtableBaseUrl}Loans${isDevMode() ? 'Dev' : ''}`,
	passports: `${config.airtableBaseUrl}Passports${isDevMode() ? 'Dev' : ''}`
};

export const FT_INCORPORATIONS_ENDPOINT = config.incorporationApiUrl;
export const FT_BANKING_ENDPOINT = config.bankAccountsApiUrl;
export const FT_PASSPORTS_ENDPOINT = config.passportsApiUrl;

export class InventoryService {
	constructor() {
		this.fetchers = {};
	}
	async fetchInventory(fetcherName) {
		if (!this.fetchers.hasOwnProperty(fetcherName)) {
			throw new Error(`no fetcher ${fetcherName}`);
		}
		return this.fetchers[fetcherName].fetch();
	}
	start() {
		this.addFetcher(new SelfkeyInventoryFetcher());
		this.addFetcher(new FlagtheoryIncorporationsInventoryFetcher());
		this.addFetcher(new FlagtheoryBankingInventoryFetcher());
		this.addFetcher(new FlagtheoryPassportsInventoryFetcher());
	}
	addFetcher(fetcher) {
		this.fetchers[fetcher.getName()] = fetcher;
	}
	loadInventory() {
		return Inventory.findAll();
	}
	upsert(upsert, hideErrors = false) {
		return Inventory.bulkUpsert(upsert, hideErrors);
	}
	deleteMany(ids) {
		return Inventory.deleteMany(ids);
	}
}

export class InventoryFetcher {
	constructor(name = 'selfkey') {
		this.name = name;
	}
	getName() {
		return this.name;
	}
	async fetch() {
		throw new Error('not_implemented');
	}
}

export class SelfkeyInventoryFetcher extends InventoryFetcher {
	async fetch() {
		let inventory = await this.fetchInventory();
		const itemsCategory = inventory
			.filter(itm => itm.status === 'active')
			.map(itm => itm.category);

		const categories = [...new Set(itemsCategory)];

		const data = await Promise.all(
			categories.map(async category => {
				try {
					const data = await this.fetchData(category);
					return data;
				} catch (error) {
					log.error('Error fetching data for %s %s', category, error);
					if (error.message === 'unknown_data_category') {
						return {};
					}
					throw error;
				}
			})
		);

		const dataByCategory = data.reduce((acc, curr, indx) => {
			acc[categories[indx]] = curr;
			return acc;
		}, {});

		return inventory.map(itm => {
			itm.data = itm.data || {};
			if (!dataByCategory[itm.category] || !dataByCategory[itm.category][itm.sku]) {
				return itm;
			}
			itm.data = { ...itm.data, ...dataByCategory[itm.category][itm.sku] };
			return itm;
		});
	}
	async fetchInventory() {
		try {
			let fetched = await request.get({ url: INVENTORY_API_ENDPOINT, json: true });
			return fetched.entities.map(entity => {
				let item = _.mapKeys(entity.data, (value, key) => _.camelCase(key));
				if (item.relyingPartyConfig) {
					try {
						item.relyingPartyConfig = JSON.parse(item.relyingPartyConfig);
						if (typeof item.relyingPartyConfig !== 'object') {
							item.relyingPartyConfig = {};
						}
					} catch (error) {
						item.relyingPartyConfig = {};
					}
				}
				return item;
			});
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
	async fetchData(category) {
		if (category === 'other' || !category) {
			return;
		}
		if (!dataEndpoints[category]) {
			throw new Error(`unknown_data_category ${category}`);
		}
		try {
			let fetched = await request.get({ url: dataEndpoints[category], json: true });
			return fetched.entities
				.map(entity => _.mapKeys(entity.data, (value, key) => _.camelCase(key)))
				.reduce((acc, curr) => {
					acc[curr.sku] = curr;
					return acc;
				}, {});
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
}

export class FlagtheoryIncorporationsInventoryFetcher extends InventoryFetcher {
	constructor() {
		super('flagtheory_incorporations');
	}
	async fetch() {
		try {
			let fetched = await request.get({ url: FT_INCORPORATIONS_ENDPOINT, json: true });
			const mapCorpDetails = (corps, curr) => {
				const corpDetails = _.mapKeys(curr.data.fields, (value, key) => _.camelCase(key));
				return { ...corps, [corpDetails.companyCode]: corpDetails };
			};
			let corpDetails = fetched.Corporations.reduce(mapCorpDetails, {});
			corpDetails = fetched.LLCs.reduce(mapCorpDetails, corpDetails);
			corpDetails = fetched.Foundations.reduce(mapCorpDetails, corpDetails);
			corpDetails = fetched.Trusts.reduce(mapCorpDetails, corpDetails);
			const enTranslations = fetched.EN.reduce(mapCorpDetails, {});
			const taxes = fetched.Taxes.reduce(mapCorpDetails, {});

			let items = fetched.Main.map(itm => {
				const data = _.mapKeys(itm.data.fields, (value, key) => _.camelCase(key));
				data.companyCode = ('' + data.companyCode || null).trim();
				data.countryCode = ('' + data.countryCode || null).trim();
				const sku = `FT-INC-${data.companyCode}`;
				let name = data.region;
				if (data.acronym && data.acronym.length) {
					name += ` (${data.acronym.join(', ')})`;
				}
				return {
					sku,
					name,
					status: data.templateId && data.showInWallet ? 'active' : 'inactive',
					price:
						data.activeTestPrice && data.testPrice
							? data.testPrice
							: data.walletPrice || null,
					priceCurrency: 'USD',
					category: 'incorporations',
					vendorId: 'flagtheory_incorporations',
					entityType: 'individual',
					data: {
						...data,
						...(corpDetails[data.companyCode] || {}),
						...(taxes[data.companyCode] || {}),
						en: { ...(enTranslations[data.companyCode] || {}) }
					}
				};
			});
			return items;
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
}

export class FlagtheoryBankingInventoryFetcher extends InventoryFetcher {
	constructor() {
		super('flagtheory_banking');
	}
	async fetch() {
		try {
			const fetched = await request.get({ url: FT_BANKING_ENDPOINT, json: true });
			const mapData = field => (acc, curr) => {
				const details = _.mapKeys(curr.data.fields, (value, key) => _.camelCase(key));
				return { ...acc, [details[field]]: details };
			};
			const jurisdictions = fetched.Jurisdictions.reduce(mapData('countryCode'), {});
			const accDetails = fetched.Account_Details.reduce(mapData('bankCode'), {});

			const items = fetched.Main.map(itm =>
				_.mapKeys(itm.data.fields, (value, key) => _.camelCase(key))
			)
				.filter(itm => itm.region && (itm.accountCode || itm.countryCode))
				.map(itm => {
					itm.accountCode = ('' + itm.accountCode || null).trim();
					itm.countryCode = ('' + itm.countryCode || null).trim();
					const sku = `FT-BNK-${itm.accountCode || itm.countryCode}`;
					const name = `${itm.region} ${itm.accountCode || itm.countryCode}`;
					let price = itm.activeTestPrice ? itm.testPrice : itm.price;
					itm = {
						sku,
						name,
						status: itm.showWallet ? 'active' : 'inactive',
						price,
						priceCurrency: 'USD',
						category: 'banking',
						vendorId: 'flagtheory_banking',
						data: {
							...itm,
							jurisdiction: jurisdictions[itm.countryCode] || {},
							accounts: Object.keys(accDetails)
								.filter(key => accDetails[key].accountCode === itm.accountCode)
								.reduce((obj, key) => {
									obj[key] = accDetails[key];
									return obj;
								}, {})
						}
					};

					itm.data.type =
						itm.data.type && itm.data.type.length
							? itm.data.type[0].toLowerCase()
							: 'private';
					itm.entityType = itm.data.type === 'business' ? 'corporate' : 'individual';

					return itm;
				});
			return items;
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
}

export class FlagtheoryPassportsInventoryFetcher extends InventoryFetcher {
	constructor() {
		super('flagtheory_passports');
	}
	async fetch() {
		try {
			let fetched = await request.get({ url: FT_PASSPORTS_ENDPOINT, json: true });
			const mapData = field => (acc, curr) => {
				const details = _.mapKeys(curr.data.fields, (value, key) => _.camelCase(key));
				return { ...acc, [details[field]]: details };
			};
			const programDescription = fetched.EN.reduce(mapData('programCode'), {});
			const items = fetched.Data.map(itm =>
				_.mapKeys(itm.data.fields, (value, key) => _.camelCase(key))
			)
				.filter(itm => itm.programCode && itm.countryCode)
				.map(itm => {
					itm.countryCode = ('' + itm.countryCode || null).trim();
					itm.programCode = ('' + itm.programCode || null).trim();
					const sku = `FT-PASS-${itm.programCode}`;
					let name = `${itm.programName} in ${itm.country}`;
					return {
						sku,
						name,
						status: itm.templateId && itm.showInWallet ? 'active' : 'inactive',
						price:
							itm.activeTestPrice && itm.testPrice
								? itm.testPrice
								: itm.walletPrice || null,
						priceCurrency: 'USD',
						category: 'passports',
						vendorId: 'flagtheory_passports',
						entityType: 'individual',
						data: {
							...itm,
							description: programDescription[itm.programCode] || {}
						}
					};
				});
			return items;
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
}

export default InventoryService;
