const { expect } = require('chai');
const WalletToken = require('../../../src/main/models/wallet-token');
const db = require('../../utils/db');
describe('WalletToken model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	xit('create', () => {});

	xit('update', () => {});

	xit('createWithNewToken', () => {});

	xit('find', () => {});

	xit('findOne', () => {});

	xit('findOneById', () => {});

	xit('findOneByWalletId', () => {});

	xit('findByWalletId', () => {});
});
