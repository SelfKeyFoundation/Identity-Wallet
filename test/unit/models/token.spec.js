const { expect } = require('chai');
const Token = require('../../../src/main/models/token');
const db = require('../../utils/db');
const initialTokens = require('../../../src/main/assets/data/eth-tokens.json');
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
		await db.reset();
	});

	it('create', async () => {
		let itm = await Token.create(testItem);
		expect(itm.id).to.be.gt(0);
		expect(itm.createdAt).to.be.gt(0);
		expect(itm.updatedAt).to.be.gt(0);
	});

	it('update', async () => {
		let itm = await Token.create(testItem);
		await Token.update({ id: itm.id, decimal: 3 });
		let found = await Token.query().findById(itm.id);
		expect(itm.id).to.eq(found.id);
		expect(itm.decimal).to.not.eq(found.decimal);
	});

	it('findAll', async () => {
		let all = await Token.findAll();
		expect(all.length).to.eq(initialTokens.length);
		await Token.create(testItem);
		await Token.create(testItem2);
		all = await Token.findAll();
		expect(all.length).to.eq(initialTokens.length + 2);
	});

	it('findBySymbol', async () => {
		let all = await Token.findBySymbol(testItem.symbol);
		expect(all.length).to.eq(0);
		await Token.create(testItem);
		await Token.create(testItem2);
		all = await Token.findBySymbol(testItem.symbol);
		expect(all.length).to.eq(1);
	});
});
