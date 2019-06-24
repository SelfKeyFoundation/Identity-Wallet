import MarketplaceCountry from './marketplace-country';
import TestDb from '../../db/test-db';

describe('MarketplaceCountry model', () => {
	const testItem = {
		code: 'test',
		name: 'Test'
	};
	const testItem2 = { code: 'test2', name: 'Test1' };

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
		let country = await MarketplaceCountry.create(testItem);
		expect(country.id).toBeGreaterThan(0);
		expect(country.createdAt).toBeGreaterThan(0);
		expect(country.updatedAt).toBeGreaterThan(0);
		expect(country.env).toBe('test');
	});

	it('findAll', async () => {
		let all = await MarketplaceCountry.findAll();
		expect(all.length).toBe(0);
		await MarketplaceCountry.create(testItem);
		await MarketplaceCountry.create(testItem2);
		all = await MarketplaceCountry.findAll();
		expect(all.length).toBe(2);
	});

	it('findByCountryCode', async () => {
		let all = await MarketplaceCountry.findAll();
		expect(all.length).toBe(0);
		await MarketplaceCountry.create(testItem);
		await MarketplaceCountry.create(testItem2);
		let itm = await MarketplaceCountry.findByCountryCode(testItem.code);
		expect(itm.code).toBe(testItem.code);
	});

	it('updateById', async () => {
		let itm = await MarketplaceCountry.create(testItem);
		let updated = await MarketplaceCountry.updateById(itm.id, { name: 'Updated name' });
		let found = await MarketplaceCountry.query().findById(itm.id);
		expect(updated).toEqual(found);
		expect(updated).not.toMatchObject(itm);
	});

	it('bulkEdit', async () => {
		let itm1 = await MarketplaceCountry.create(testItem);
		let itm2 = await MarketplaceCountry.create(testItem2);
		let all = await MarketplaceCountry.query();
		expect(all.length).toBe(2);
		itm1.name = 'modified';
		itm2.name = 'modified';
		await MarketplaceCountry.bulkEdit([itm1, itm2]);
		all = await MarketplaceCountry.query();
		expect(all.length).toBe(2);
		expect(all[0].name).toBe('modified');
		expect(all[1].name).toBe('modified');
	});

	it('bulkAdd', async () => {
		let all = await MarketplaceCountry.query();
		expect(all.length).toBe(0);
		await MarketplaceCountry.bulkAdd([testItem, testItem2]);
		all = await MarketplaceCountry.query();
		expect(all.length).toBe(2);
	});

	it('bulkUpsert', async () => {
		await MarketplaceCountry.create({
			code: 'untouched',
			name: 'untouched'
		});
		const inserted = await MarketplaceCountry.bulkAdd([testItem, testItem2]);
		const upsert = [
			{ ...inserted[0], name: 'modified' },
			{ ...inserted[1], name: 'modified2' },
			{ code: '3', name: '3' },
			{ code: '4', name: '4' }
		];
		const results = await MarketplaceCountry.bulkUpsert(upsert);
		expect(results.length).toEqual(4);
		const all = await MarketplaceCountry.findAll();
		expect(all.length).toBe(5);
		expect(all.find(itm => itm.id === inserted[0].id).name).toBe('modified');
	});
});
