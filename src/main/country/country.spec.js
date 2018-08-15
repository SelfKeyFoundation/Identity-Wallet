import Country from './country';
import TestDb from '../db/test-db';

describe('Country model', () => {
	let db;
	beforeAll(async () => {
		db = new TestDb();
		await db.init();
	});
	beforeEach(async () => {
		await db.reset();
	});
	it('findAll', async () => {
		const countries = await Country.findAll();
		expect(countries.length).toBeGreaterThan(0);
	});
});
