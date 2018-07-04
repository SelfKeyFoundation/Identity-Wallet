const { expect } = require('chai');
const WalletToken = require('../../../src/main/models/wallet-token');
const db = require('../../utils/db');
describe('WalletToken model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {});

	it('update', async () => {});

	it('createWithNewToken', () => {});

	it('find', () => {});

	it('findOne', () => {});

	it('findOneById', () => {});

	it('findOneByWalletId', () => {});

	it('findByWalletId', () => {});
});
