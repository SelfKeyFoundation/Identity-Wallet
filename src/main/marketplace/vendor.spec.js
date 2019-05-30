import Vendor from './vendor';
import TestDb from '../db/test-db';

describe('Vendor model', () => {
	const testItem = {
		vendorId: 'test',
		name: 'test'
	};
	const testItem2 = { vendorId: 'test2', name: 'test2' };

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
		let vendor = await Vendor.create(testItem);
		expect(vendor.id).toBeGreaterThan(0);
		expect(vendor.createdAt).toBeGreaterThan(0);
		expect(vendor.updatedAt).toBeGreaterThan(0);
		expect(vendor.env).toBe('test');
	});

	it('findAll', async () => {
		let all = await Vendor.findAll();
		expect(all.length).toBe(0);
		await Vendor.create(testItem);
		await Vendor.create(testItem2);
		all = await Vendor.findAll();
		expect(all.length).toBe(2);
	});

	it('findByVendorId', async () => {
		let all = await Vendor.findAll();
		expect(all.length).toBe(0);
		await Vendor.create(testItem);
		await Vendor.create(testItem2);
		let itm = await Vendor.findByVendorId(testItem.vendorId);
		expect(itm.vendorId).toBe(testItem.vendorId);
	});

	it('updateById', async () => {
		let itm = await Vendor.create(testItem);
		let updated = await Vendor.updateById(itm.id, { name: 'Updated name' });
		let found = await Vendor.query().findById(itm.id);
		expect(updated).toEqual(found);
		expect(updated).not.toMatchObject(itm);
	});

	it('bulkEdit', async () => {
		let itm1 = await Vendor.create(testItem);
		let itm2 = await Vendor.create(testItem2);
		let all = await Vendor.query();
		expect(all.length).toBe(2);
		itm1.name = 'modified';
		itm2.name = 'modified';
		await Vendor.bulkEdit([itm1, itm2]);
		all = await Vendor.query();
		expect(all.length).toBe(2);
		expect(all[0].name).toBe('modified');
		expect(all[1].name).toBe('modified');
	});

	it('bulkAdd', async () => {
		let all = await Vendor.query();
		expect(all.length).toBe(0);
		await Vendor.bulkAdd([testItem, testItem2]);
		all = await Vendor.query();
		expect(all.length).toBe(2);
	});
});
