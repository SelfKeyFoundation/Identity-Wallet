import TaxTreaties from './tax-treaties';
import TestDb from '../../db/test-db';

describe('TaxTreaties model', () => {
	const testItem = {
		countryCode: 'test',
		jurisdictionCountryCode: 'jur'
	};
	const testItem2 = { countryCode: 'test2', jurisdictionCountryCode: 'jur2' };

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
		let country = await TaxTreaties.create(testItem);
		expect(country.id).toBeGreaterThan(0);
		expect(country.createdAt).toBeGreaterThan(0);
		expect(country.updatedAt).toBeGreaterThan(0);
		expect(country.env).toBe('test');
	});

	it('findAll', async () => {
		let all = await TaxTreaties.findAll();
		expect(all.length).toBe(0);
		await TaxTreaties.create(testItem);
		await TaxTreaties.create(testItem2);
		all = await TaxTreaties.findAll();
		expect(all.length).toBe(2);
	});

	it('findByCountryCode', async () => {
		let all = await TaxTreaties.findAll();
		expect(all.length).toBe(0);
		await TaxTreaties.create(testItem);
		await TaxTreaties.create(testItem2);
		let itm = await TaxTreaties.findByCountryCode(testItem.countryCode);
		expect(itm.countryCode).toBe(testItem.countryCode);
	});

	it('updateById', async () => {
		let itm = await TaxTreaties.create(testItem);
		let updated = await TaxTreaties.updateById(itm.id, {
			jurisdiction: 'Updated jurisdiction'
		});
		let found = await TaxTreaties.query().findById(itm.id);
		expect(updated).toEqual(found);
		expect(updated).not.toMatchObject(itm);
	});

	it('bulkEdit', async () => {
		let itm1 = await TaxTreaties.create(testItem);
		let itm2 = await TaxTreaties.create(testItem2);
		let all = await TaxTreaties.query();
		expect(all.length).toBe(2);
		itm1.jurisdiction = 'modified';
		itm2.jurisdiction = 'modified';
		await TaxTreaties.bulkEdit([itm1, itm2]);
		all = await TaxTreaties.query();
		expect(all.length).toBe(2);
		expect(all[0].jurisdiction).toBe('modified');
		expect(all[1].jurisdiction).toBe('modified');
	});

	it('bulkAdd', async () => {
		let all = await TaxTreaties.query();
		expect(all.length).toBe(0);
		await TaxTreaties.bulkAdd([testItem, testItem2]);
		all = await TaxTreaties.query();
		expect(all.length).toBe(2);
	});

	it('bulkUpsert', async () => {
		await TaxTreaties.create({
			countryCode: 'untouched',
			jurisdiction: 'untouched',
			jurisdictionCountryCode: 'untouched'
		});
		const inserted = await TaxTreaties.bulkAdd([testItem, testItem2]);
		const upsert = [
			{ ...inserted[0], jurisdiction: 'modified' },
			{ ...inserted[1], jurisdiction: 'modified2' },
			{ countryCode: '3', jurisdiction: '3', jurisdictionCountryCode: '3' },
			{ countryCode: '4', jurisdiction: '4', jurisdictionCountryCode: '4' }
		];
		const results = await TaxTreaties.bulkUpsert(upsert);
		expect(results.length).toEqual(4);
		const all = await TaxTreaties.findAll();
		expect(all.length).toBe(5);
		expect(all.find(itm => itm.id === inserted[0].id).jurisdiction).toBe('modified');
	});
});
