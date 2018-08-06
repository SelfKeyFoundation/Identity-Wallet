import TokenPrice from './token-price';
import db from '../db/test-db';

describe('TokenPrice model', () => {
	const testItem = {
		name: 'test',
		symbol: 'TST'
	};
	const testItem2 = { name: 'test2', symbol: 'TST2' };
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		let itm = await TokenPrice.create(testItem);
		expect(itm.id).toBeGreaterThan(0);
		expect(itm.createdAt).toBeGreaterThan(0);
		expect(itm.updatedAt).toBeGreaterThan(0);
	});

	it('findAll', async () => {
		let all = await TokenPrice.findAll();
		expect(all.length).toBe(0);
		await TokenPrice.create(testItem);
		await TokenPrice.create(testItem2);
		all = await TokenPrice.findAll();
		expect(all.length).toBe(2);
	});

	it('findAllBySymbol', async () => {
		let all = await TokenPrice.findAll();
		expect(all.length).toBe(0);
		await TokenPrice.create(testItem);
		await TokenPrice.create(testItem2);
		let itm = await TokenPrice.findBySymbol(testItem.symbol);
		expect(itm.symbol).toBe(testItem.symbol);
	});

	it('updateById', async () => {
		let itm = await TokenPrice.create(testItem);
		let updated = await TokenPrice.updateById(itm.id, { source: 'source˝' });
		let found = await TokenPrice.query().findById(itm.id);
		expect(updated).toEqual(found);
		expect(updated).not.toMatchObject(itm);
	});

	it('bulkEdit', async () => {
		let itm1 = await TokenPrice.create(testItem);
		let itm2 = await TokenPrice.create(testItem2);
		let all = await TokenPrice.query();
		expect(all.length).toBe(2);
		itm1.source = 'modified';
		itm2.source = 'modified';
		await TokenPrice.bulkEdit([itm1, itm2]);
		all = await TokenPrice.query();
		expect(all.length).toBe(2);
		expect(all[0].source).toBe('modified');
		expect(all[1].source).toBe('modified');
	});

	it('bulkAdd', async () => {
		let all = await TokenPrice.query();
		expect(all.length).toBe(0);
		await TokenPrice.bulkAdd([testItem, testItem2]);
		all = await TokenPrice.query();
		expect(all.length).toBe(2);
	});
});
