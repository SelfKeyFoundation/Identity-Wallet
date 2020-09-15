import Contract from './contract';
import TestDb from '../../db/test-db';

describe('Contract model', () => {
	const testItem = {
		name: 'test',
		address: 'test'
	};
	const testItem2 = { name: 'test2', address: 'test2' };

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
		let contract = await Contract.create(testItem);
		expect(contract.id).toBeGreaterThan(0);
		expect(contract.createdAt).toBeGreaterThan(0);
		expect(contract.updatedAt).toBeGreaterThan(0);
		expect(contract.env).toBe('test');
	});

	it('findAll', async () => {
		let all = await Contract.findAll();
		expect(all.length).toBe(0);
		await Contract.create(testItem);
		await Contract.create(testItem2);
		all = await Contract.findAll();
		expect(all.length).toBe(2);
	});

	it('updateById', async () => {
		let itm = await Contract.create(testItem);
		let updated = await Contract.updateById(itm.id, { name: 'Updated name' });
		let found = await Contract.query().findById(itm.id);
		expect(updated).toEqual(found);
		expect(updated).not.toMatchObject(itm);
	});

	it('bulkEdit', async () => {
		let itm1 = await Contract.create(testItem);
		let itm2 = await Contract.create(testItem2);
		let all = await Contract.query();
		expect(all.length).toBe(2);
		itm1.name = 'modified';
		itm2.name = 'modified';
		await Contract.bulkEdit([itm1, itm2]);
		all = await Contract.query();
		expect(all.length).toBe(2);
		expect(all[0].name).toBe('modified');
		expect(all[1].name).toBe('modified');
	});

	it('bulkAdd', async () => {
		let all = await Contract.query();
		expect(all.length).toBe(0);
		await Contract.bulkAdd([testItem, testItem2]);
		all = await Contract.query();
		expect(all.length).toBe(2);
	});

	it('bulkUpsert', async () => {
		await Contract.create({
			name: 'untouched',
			address: 'untouched'
		});
		const inserted = await Contract.bulkAdd([testItem, testItem2]);
		const upsert = [
			{ ...inserted[0], name: 'modified' },
			{ ...inserted[1], name: 'modified2' },
			{ name: '3', address: '3' },
			{ name: '4', address: '4' }
		];
		const results = await Contract.bulkUpsert(upsert);
		expect(results.length).toEqual(4);
		const all = await Contract.findAll();
		expect(all.length).toBe(5);
		expect(all.find(itm => itm.id === inserted[0].id).name).toBe('modified');
	});
});
