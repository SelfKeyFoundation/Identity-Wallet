import MarketplaceOrder from './order';
import TestDb from '../../db/test-db';

describe('Vendor model', () => {
	const testItem = {
		id: 1,
		vendorId: 'test',
		itemId: 'test',
		identityId: 1
	};
	const testItem2 = { identityId: 1, vendorId: 'test2', itemId: 'test2' };

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
		let order = await MarketplaceOrder.create(testItem);
		expect(order.id).toBeGreaterThan(0);
		expect(order.createdAt).toBeGreaterThan(0);
		expect(order.updatedAt).toBeGreaterThan(0);
		expect(order.env).toBe('test');
	});

	it('findAll', async () => {
		let all = await MarketplaceOrder.findAll();
		expect(all.length).toBe(0);
		await MarketplaceOrder.create(testItem);
		await MarketplaceOrder.create(testItem2);
		all = await MarketplaceOrder.findAll();
		expect(all.length).toBe(2);
	});

	it('findById', async () => {
		let all = await MarketplaceOrder.findAll();
		expect(all.length).toBe(0);
		await MarketplaceOrder.create(testItem);
		await MarketplaceOrder.create(testItem2);
		let itm = await MarketplaceOrder.findById(testItem.id);
		expect(itm.id).toBe(testItem.id);
	});

	it('updateById', async () => {
		let itm = await MarketplaceOrder.create(testItem);
		let updated = await MarketplaceOrder.updateById(itm.id, { productInfo: 'Updated name' });
		let found = await MarketplaceOrder.query().findById(itm.id);
		expect(updated).toEqual(found);
		expect(updated).not.toMatchObject(itm);
	});
});
