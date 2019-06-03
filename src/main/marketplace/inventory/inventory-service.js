import config from 'common/config';
import { Inventory } from './inventory';
import request from 'request-promise-native';
import { isDevMode } from 'common/utils/common';
import _ from 'lodash';

export const INVENTORY_API_ENDPOINT = `${config.airtableBaseUrl}Inventory${
	isDevMode() ? 'Dev' : ''
}`;

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
		const fetched = await request.get({ url: INVENTORY_API_ENDPOINT, json: true });
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
