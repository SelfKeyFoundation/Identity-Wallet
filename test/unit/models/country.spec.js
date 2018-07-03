const { expect } = require('chai');
const Country = require('../../../src/main/models/country');

describe('country model', () => {
	it('findAll', async () => {
		const countries = await Country.findAll();
		expect(countries.length).to.be.gt(0);
	});
});
