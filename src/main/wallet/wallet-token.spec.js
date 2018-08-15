import WalletToken from './wallet-token';
import TestDb from '../db/test-db';

describe('WalletToken model', () => {
	let db;
	beforeAll(async () => {
		db = new TestDb();
		await db.init();
	});
	const testItem = {
		walletId: 1,
		tokenId: 1,
		balance: '0'
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
		expect(itm.id).toBeGreaterThan(0);
		expect(itm.createdAt).toBeGreaterThan(0);
		expect(itm.updatedAt).toBeGreaterThan(0);
	});

	it('update', async () => {
		let itm = await WalletToken.create(testItem);
		await WalletToken.update({ id: itm.id, balance: '3' });
		let found = await WalletToken.query().findById(itm.id);
		expect(itm.id).toBe(found.id);
		expect(itm.balance).not.toBe(found.balance);
	});

	it('createWithNewToken', async () => {
		let walletToken = await WalletToken.createWithNewToken(testToken, '5', 1);
		let createdToken = await walletToken.$relatedQuery('token');
		expect(createdToken.symbol).toBe(testToken.symbol);
		expect(walletToken.id).toBeGreaterThan(0);
		expect(walletToken.createdAt).toBeGreaterThan(0);
		expect(walletToken.balance).toBe(5);
	});

	it('find', async () => {
		let walletToken = await WalletToken.createWithNewToken(testToken, '5', 1);
		let createdToken = await walletToken.$relatedQuery('token');

		let found = await WalletToken.find({ 'wallet_tokens.id': walletToken.id });
		expect(found.length).toBe(1);
		expect(found[0].symbol).toBe(createdToken.symbol);
	});

	it('findByWalletId', async () => {
		let walletToken = await WalletToken.createWithNewToken(testToken, '5', 1);
		let createdToken = await walletToken.$relatedQuery('token');

		await WalletToken.createWithNewToken(testToken2, '2', 1);

		let found = await WalletToken.findByWalletId(1);
		expect(found.length).toBe(2);
		expect(found[0].symbol).toBe(createdToken.symbol);
	});
});
