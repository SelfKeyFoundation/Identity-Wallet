const { expect } = require('chai');
const WalletSetting = require('../../../src/main/models/wallet-setting');
const db = require('../../utils/db');
describe('WalletSetting model', () => {
	beforeEach(async () => {
		await db.reset();
	});
	it('create', () => {});
	it('findByWalletId', () => {});
	it('updateById', () => {});
});
