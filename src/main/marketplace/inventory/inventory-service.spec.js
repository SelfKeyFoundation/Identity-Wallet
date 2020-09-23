import sinon from 'sinon';
import {
	InventoryService,
	INVENTORY_API_ENDPOINT,
	FT_INCORPORATIONS_ENDPOINT,
	FT_BANKING_ENDPOINT,
	InventoryFetcher,
	SelfkeyInventoryFetcher,
	FlagtheoryIncorporationsInventoryFetcher,
	FlagtheoryBankingInventoryFetcher,
	dataEndpoints
} from './inventory-service';
import { Inventory } from './inventory';
import request from 'request-promise-native';
import inventoryResponseFixture from './__fixtures__/inventory-airtable-response';
import inventoryFetched from './__fixtures__/inventory-fetched';
import inventoryDb from './__fixtures__/inventory-db';
import exchangesData from './__fixtures__/exchanges-airtable-data';
import exchangesDataFetched from './__fixtures__/exchanges-data-fetched';
import inventoryWithData from './__fixtures__/inventory-with-exchanges-data';
import ftIncResponseFixture from './__fixtures__/ft-incorporations-response';
import ftIncFetched from './__fixtures__/ft-incorporations-fetched';
import ftBankResponseFixture from './__fixtures__/ft-banking-response';
import ftBankFetched from './__fixtures__/ft-banking-fetched';

describe('InventoryService', () => {
	let schedulerService = {};
	let inventoryService;
	beforeEach(() => {
		inventoryService = new InventoryService({ schedulerService });
	});
	afterEach(() => {
		sinon.restore();
	});
	it('should load inventory from db', async () => {
		sinon.stub(Inventory, 'findAll').resolves(inventoryDb);
		const loaded = await inventoryService.loadInventory();
		expect(Inventory.findAll.calledOnce).toBe(true);
		expect(loaded).toEqual(inventoryDb);
	});
	it('should upsert inventory to db', async () => {
		sinon.stub(Inventory, 'bulkUpsert').resolves('ok');
		const inventory = [1, 2, 3];
		const loaded = await inventoryService.upsert(inventory);
		expect(Inventory.bulkUpsert.getCall(0).args).toEqual([inventory, false]);
		expect(loaded).toEqual('ok');
	});
	it('should delete many inventory from db', async () => {
		sinon.stub(Inventory, 'deleteMany').resolves('ok');
		const inventory = [1, 2, 3];
		const loaded = await inventoryService.deleteMany(inventory);
		expect(Inventory.deleteMany.getCall(0).args).toEqual([inventory]);
		expect(loaded).toEqual('ok');
	});
});

describe('InventortFetcher', () => {
	it('should return name', () => {
		const fetcher = new InventoryFetcher('test');
		expect(fetcher.getName()).toBe('test');
	});
});

describe('SelfkeyInventoryFetcher', () => {
	let fetcher;

	beforeEach(() => {
		fetcher = new SelfkeyInventoryFetcher();
	});
	afterEach(() => {
		sinon.restore();
	});
	it('should fetch', async () => {
		sinon.stub(fetcher, 'fetchInventory').resolves(inventoryFetched());
		sinon.stub(fetcher, 'fetchData').resolves(exchangesDataFetched());
		const resp = await fetcher.fetch();
		expect(fetcher.fetchInventory.calledOnce).toBe(true);
		expect(fetcher.fetchData.calledOnce).toBe(true);
		expect(resp).toEqual(inventoryWithData);
	});
	it('should fetch inventory', async () => {
		sinon.stub(request, 'get').resolves(inventoryResponseFixture);
		const resp = await fetcher.fetchInventory();
		expect(request.get.getCall(0).args).toEqual([{ url: INVENTORY_API_ENDPOINT, json: true }]);
		expect(resp).toEqual(inventoryFetched());
	});
	it('should fetch inventory data', async () => {
		sinon.stub(request, 'get').resolves(exchangesData);
		const resp = await fetcher.fetchData('exchanges');
		expect(request.get.getCall(0).args).toEqual([
			{ url: dataEndpoints['exchanges'], json: true }
		]);
		expect(resp).toEqual(exchangesDataFetched());
	});
});

describe('FlagtheoryIncorporationsInventoryFetcher', () => {
	let fetcher;

	beforeEach(() => {
		fetcher = new FlagtheoryIncorporationsInventoryFetcher();
	});
	afterEach(() => {
		sinon.restore();
	});
	it('should fetch', async () => {
		sinon.stub(request, 'get').resolves(ftIncResponseFixture());
		const resp = await fetcher.fetch();
		expect(request.get.getCall(0).args).toEqual([
			{ url: FT_INCORPORATIONS_ENDPOINT, json: true }
		]);
		expect(resp).toEqual(ftIncFetched());
	});
});

describe('FlagtheoryBankingInventoryFetcher', () => {
	let fetcher;

	beforeEach(() => {
		fetcher = new FlagtheoryBankingInventoryFetcher();
	});
	afterEach(() => {
		sinon.restore();
	});
	it('should fetch', async () => {
		sinon.stub(request, 'get').resolves(ftBankResponseFixture());
		const resp = await fetcher.fetch();
		expect(request.get.getCall(0).args).toEqual([{ url: FT_BANKING_ENDPOINT, json: true }]);
		expect(resp).toEqual(ftBankFetched());
	});
});
