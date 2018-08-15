import Token from './token';
import TestDb from '../db/test-db';
import initialTokens from 'main/assets/data/eth-tokens.json';

describe('Token model', () => {
	let db;
	beforeAll(async () => {
		db = new TestDb();
		await db.init();
	});
	const testItem = {
		symbol: 'TST',
		decimal: 2,
		address: 'test address'
	};
	const testItem2 = {
		symbol: 'TST2',
		decimal: 3,
		address: 'test address2'
	};
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		let itm = await Token.create(testItem);
		expect(itm.id).toBeGreaterThan(0);
		expect(itm.createdAt).toBeGreaterThan(0);
		expect(itm.updatedAt).toBeGreaterThan(0);
	});

	it('update', async () => {
		let itm = await Token.create(testItem);
		await Token.update({ id: itm.id, decimal: 3 });
		let found = await Token.query().findById(itm.id);
		expect(itm.id).toBe(found.id);
		expect(itm.decimal).not.toBe(found.decimal);
	});

	it('findAll', async () => {
		let all = await Token.findAll();
		expect(all.length).toBe(initialTokens.length);
		await Token.create(testItem);
		await Token.create(testItem2);
		all = await Token.findAll();
		expect(all.length).toBe(initialTokens.length + 2);
	});

	it('findBySymbol', async () => {
		let all = await Token.findBySymbol(testItem.symbol);
		expect(all.length).toBe(0);
		await Token.create(testItem);
		await Token.create(testItem2);
		all = await Token.findBySymbol(testItem.symbol);
		expect(all.length).toBe(1);
	});
});
