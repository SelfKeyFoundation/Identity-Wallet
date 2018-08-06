import Country from './country';
import db from '../db/test-db';

beforeAll(async () => {
	await db.init();
});
describe('Country model', () => {
	beforeEach(async () => {
		await db.reset();
	});
	it('findAll', async () => {
		const countries = await Country.findAll();
		expect(countries.length).toBeGreaterThan(0);
	});
});
