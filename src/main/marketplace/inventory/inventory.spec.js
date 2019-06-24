import Inventory from './inventory';
import TestDb from '../../db/test-db';

describe('Inventory model', () => {
	const testItem = {
		sku: 'test',
		vendorId: 'test',
		name: 'test',
		category: 'exchanges'
	};
	const testItem2 = { sku: 'test2', vendorId: 'test2', name: 'test2', category: 'banking' };

	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});

	it('create', async () => {
		let inventory = await Inventory.create(testItem);
		expect(inventory.id).toBeGreaterThan(0);
		expect(inventory.createdAt).toBeGreaterThan(0);
		expect(inventory.updatedAt).toBeGreaterThan(0);
		expect(inventory.env).toBe('test');
	});

	it('findAll', async () => {
		let all = await Inventory.findAll();
		expect(all.length).toBe(0);
		await Inventory.create(testItem);
		await Inventory.create(testItem2);
		all = await Inventory.findAll();
		expect(all.length).toBe(2);
	});

	it('findBySku', async () => {
		let all = await Inventory.findAll();
		expect(all.length).toBe(0);
		await Inventory.create(testItem);
		await Inventory.create(testItem2);
		let itm = await Inventory.findBySku(testItem.sku);
		expect(itm.sku).toBe(testItem.sku);
	});

	it('updateById', async () => {
		let itm = await Inventory.create(testItem);
		let updated = await Inventory.updateById(itm.id, { name: 'Updated name' });
		let found = await Inventory.query().findById(itm.id);
		expect(updated).toEqual(found);
		expect(updated).not.toMatchObject(itm);
	});

	it('bulkEdit', async () => {
		let itm1 = await Inventory.create(testItem);
		let itm2 = await Inventory.create(testItem2);
		let all = await Inventory.query();
		expect(all.length).toBe(2);
		itm1.name = 'modified';
		itm2.name = 'modified';
		await Inventory.bulkEdit([itm1, itm2]);
		all = await Inventory.query();
		expect(all.length).toBe(2);
		expect(all[0].name).toBe('modified');
		expect(all[1].name).toBe('modified');
	});

	it('bulkAdd', async () => {
		let all = await Inventory.query();
		expect(all.length).toBe(0);
		await Inventory.bulkAdd([testItem, testItem2]);
		all = await Inventory.query();
		expect(all.length).toBe(2);
	});

	it('bulkUpsert', async () => {
		await Inventory.create({
			sku: 'untouched',
			vendorId: 'untouched',
			category: 'incorporations'
		});
		const inserted = await Inventory.bulkAdd([testItem, testItem2]);
		const upsert = [
			{ ...inserted[0], name: 'modified' },
			{ ...inserted[1], name: 'modified2' },
			{ sku: '3', vendorId: '3', category: 'banking' },
			{ sku: '4', vendorId: '4', category: 'banking' }
		];
		const results = await Inventory.bulkUpsert(upsert);
		expect(results.length).toEqual(4);
		const all = await Inventory.findAll();
		expect(all.length).toBe(5);
		expect(all.find(itm => itm.id === inserted[0].id).name).toBe('modified');
	});
});
