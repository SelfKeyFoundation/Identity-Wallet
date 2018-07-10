const { expect } = require('chai');
const TokenPrice = require('../../../src/main/models/token-price');
const db = require('../../utils/db');

describe('TokenPrice model', () => {
	const testItem = {
		name: 'test',
		symbol: 'TST'
	};
	const testItem2 = { name: 'test2', symbol: 'TST2' };
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		let itm = await TokenPrice.create(testItem);
		expect(itm.id).to.be.gt(0);
		expect(itm.createdAt).to.be.gt(0);
		expect(itm.updatedAt).to.be.gt(0);
	});

	it('findAll', async () => {
		let all = await TokenPrice.findAll();
		expect(all.length).to.eq(0);
		await TokenPrice.create(testItem);
		await TokenPrice.create(testItem2);
		all = await TokenPrice.findAll();
		expect(all.length).to.eq(2);
	});

	it('findAllBySymbol', async () => {
		let all = await TokenPrice.findAll();
		expect(all.length).to.eq(0);
		await TokenPrice.create(testItem);
		await TokenPrice.create(testItem2);
		let itm = await TokenPrice.findBySymbol(testItem.symbol);
		expect(itm.symbol).to.eq(testItem.symbol);
	});

	it('updateById', async () => {
		let itm = await TokenPrice.create(testItem);
		let updated = await TokenPrice.updateById(itm.id, { source: 'source˝' });
		let found = await TokenPrice.query().findById(itm.id);
		expect(updated).to.deep.eq(found);
		expect(updated).to.not.deep.eq(itm);
	});

	it('bulkEdit', async () => {
		let itm1 = await TokenPrice.create(testItem);
		let itm2 = await TokenPrice.create(testItem2);
		let all = await TokenPrice.query();
		expect(all.length).to.eq(2);
		itm1.source = 'modified';
		itm2.source = 'modified';
		await TokenPrice.bulkEdit([itm1, itm2]);
		all = await TokenPrice.query();
		expect(all.length).to.eq(2);
		expect(all[0].source).to.eq('modified');
		expect(all[1].source).to.eq('modified');
	});

	it('bulkAdd', async () => {
		let all = await TokenPrice.query();
		expect(all.length).to.eq(0);
		await TokenPrice.bulkAdd([testItem, testItem2]);
		all = await TokenPrice.query();
		expect(all.length).to.eq(2);
	});
});
