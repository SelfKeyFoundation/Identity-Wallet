import sinon from 'sinon';
import {
	InventoryService,
	INVENTORY_API_ENDPOINT,
	InventoryFetcher,
	SelfkeyInventoryFetcher
} from './inventory-service';
import { Inventory } from './inventory';
import request from 'request-promise-native';
import inventoryResponseFixture from './__fixtures__/inventory-airtable-response';
import inventoryFetched from './__fixtures__/inventory-fetched';
import inventoryDb from './__fixtures__/inventory-db';

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
		expect(Inventory.bulkUpsert.getCall(0).args).toEqual([inventory]);
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
	it('should make fetch data', async () => {
		sinon.stub(request, 'get').resolves(inventoryResponseFixture);
		const resp = await fetcher.fetch();
		expect(request.get.getCall(0).args).toEqual([{ url: INVENTORY_API_ENDPOINT, json: true }]);
		expect(resp).toEqual(inventoryFetched);
	});
});
