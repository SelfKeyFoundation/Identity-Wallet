const { expect } = require('chai');
const Token = require('../../../src/main/models/token');
const db = require('../../utils/db');
describe('Token model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {});

	it('update', async () => {});

	it('findAll', () => {});

	it('findBySymbol', () => {});
});
