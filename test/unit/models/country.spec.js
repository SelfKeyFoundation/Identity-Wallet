const { expect } = require('chai');
const Country = require('../../../src/main/models/country');
const db = require('../../utils/db');
describe('Country model', () => {
	beforeEach(async () => {
		await db.reset();
	});
	it('findAll', async () => {
		const countries = await Country.findAll();
		expect(countries.length).to.be.gt(0);
	});
});
