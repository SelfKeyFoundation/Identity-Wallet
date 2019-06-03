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
	banking: `${config.airtableBaseUrl}Banking${isDevMode() ? 'Dev' : ''}`
};

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
	}
	addFetcher(fetcher) {
		this.fetchers[fetcher.getName()] = fetcher;
	}
	loadInventory() {
		return Inventory.findAll();
	}
	upsert(upsert) {
		return Inventory.bulkUpsert(upsert);
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
		const categories = inventory
			.filter(itm => itm.status === 'active')
			.map(itm => itm.category);

		const data = await Promise.all([...new Set(categories)].map(this.fetchData.bind(this)));
		const dataByCategory = data.reduce((acc, curr, indx) => {
			acc[categories[indx]] = curr;
			return acc;
		}, {});
		return inventory.map(itm => {
			itm.data = itm.data || {};
			if (!dataByCategory[itm.category] || !dataByCategory[itm.category][itm.sku]) {
				return itm;
			}
			itm.data = dataByCategory[itm.category][itm.sku];
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
			return [];
		}
	}
	async fetchData(category) {
		if (!dataEndpoints[category]) {
			throw new Error('unknown_data_category');
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
			return {};
		}
	}
}

export class FlagtheoryIncorporationsInventoryFetcher extends InventoryFetcher {
	constructor() {
		super('flagtheory_incorporations');
	}
}

export class FlagtheoryBankingInventoryFetcher extends InventoryFetcher {
	constructor() {
		super('flagtheory_banking');
	}
}

export default InventoryService;
