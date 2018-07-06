const { expect } = require('chai');
const Exchange = require('../../../src/main/models/exchange');
const db = require('../../utils/db');

describe('Exchange model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	xit('create', () => {});

	xit('findAll', () => {});

	xit('import', () => {});
});
