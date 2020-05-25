import Token from './token';
import TestDb from '../db/test-db';
import EthTokens from 'main/assets/data/eth-tokens.json';

const initialTokens = EthTokens.filter(t => t.networkId === 1);

describe('Token model', () => {
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
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
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
		// imit KI token from results
		const tokenLength = initialTokens.length;
		expect(all.length).toBe(tokenLength);
		await Token.create(testItem);
		await Token.create(testItem2);
		all = await Token.findAll();
		expect(all.length).toBe(tokenLength + 2);
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
