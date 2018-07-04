const { expect } = require('chai');
const Token = require('../../../src/main/models/token');
const db = require('../../utils/db');
describe('Token model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	it('create', () => {});

	it('update', () => {});

	it('findAll', () => {});

	it('findBySymbol', () => {});
});
