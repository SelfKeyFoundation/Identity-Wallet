const { expect } = require('chai');
const WalletToken = require('../../../src/main/models/wallet-token');
const db = require('../../utils/db');
describe('WalletToken model', () => {
	const testItem = {
		walletId: 1,
		tokenId: 1,
		balance: 0
	};

	const testItem2 = {
		walletId: 1,
		tokenId: 2,
		balance: 0
	};

	const testToken = {
		symbol: 'TST',
		decimal: 2,
		address: 'test address'
	};

	const testToken2 = {
		symbol: 'TST2',
		decimal: 5,
		address: 'test address2'
	};

	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		let itm = await WalletToken.create(testItem);
		expect(itm.id).to.be.gt(0);
		expect(itm.createdAt).to.be.gt(0);
		expect(itm.updatedAt).to.be.gt(0);
	});

	it('update', async () => {
		let itm = await WalletToken.create(testItem);
		await WalletToken.update({ id: itm.id, balance: 3 });
		let found = await WalletToken.query().findById(itm.id);
		expect(itm.id).to.eq(found.id);
		expect(itm.balance).to.not.eq(found.balance);
	});

	it('createWithNewToken', async () => {
		let walletToken = await WalletToken.createWithNewToken(testToken, 5, 1);
		let createdToken = await walletToken.$relatedQuery('token');
		expect(createdToken.symbol).to.eq(testToken.symbol);
		expect(walletToken.id).to.be.gt(0);
		expect(walletToken.createdAt).to.be.gt(0);
		expect(walletToken.balance).to.eq(5);
	});

	it('find', async () => {
		let walletToken = await WalletToken.createWithNewToken(testToken, 5, 1);
		let createdToken = await walletToken.$relatedQuery('token');

		let found = await WalletToken.find({ 'wallet_tokens.id': walletToken.id });
		expect(found.length).to.eq(1);
		expect(found[0].symbol).to.be.eq(createdToken.symbol);
	});

	it('findByWalletId', async () => {
		let walletToken = await WalletToken.createWithNewToken(testToken, 5, 1);
		let createdToken = await walletToken.$relatedQuery('token');

		let walletToken2 = await WalletToken.createWithNewToken(testToken2, 2, 1);

		let found = await WalletToken.findByWalletId(1);
		expect(found.length).to.eq(2);
		expect(found[0].symbol).to.be.eq(createdToken.symbol);
	});
});
