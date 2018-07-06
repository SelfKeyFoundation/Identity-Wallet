const { expect } = require('chai');
const Document = require('../../../src/main/models/document');
const db = require('../../utils/db');
describe('Country model', () => {
	beforeEach(async () => {
		await db.reset();
	});
	xit('findById', async () => {});

	xit('create', async () => {});

	xit('delete', async () => {});
});
