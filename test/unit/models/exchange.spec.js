const { expect } = require('chai');
const Exchange = require('../../../src/main/models/exchange');
const db = require('../../utils/db');
const _ = require('lodash');

describe('Exchange model', () => {
	const testItem = {
		name: 'test',
		data: {
			some: 'data',
			some2: 'data2',
			nested: { nested: 'data3' },
			array: [{ array: 1 }]
		}
	};
	const testItem2 = { ...testItem, name: `${testItem.name}2` };
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		const itm = await Exchange.create(testItem);
		const itm2 = await Exchange.create(testItem2);
		expect(itm.name).to.eq(testItem.name);
		expect(itm2.name).to.eq(testItem2.name);
		expect(itm.data).to.deep.eq(testItem.data);
		expect(itm2.data).to.deep.eq(testItem2.data);
		expect(itm).to.deep.eq(await Exchange.query().findById(itm.name));
	});

	it('findAll', async () => {
		const itm = await Exchange.create(testItem);
		const itm2 = await Exchange.create(testItem2);
		const items = await Exchange.findAll();
		expect(items.length).to.eq(2);
		expect(items).to.deep.contain(itm);
		expect(items).to.deep.contain(itm2);
	});

	it('import', async () => {
		const itm = await Exchange.create(testItem);
		const changedItem = { name: 'test', data: { changed: true } };
		await Exchange.import([changedItem, testItem2]);
		const all = await Exchange.query();
		const changedInDb = _.find(all, { name: 'test' });
		expect(changedInDb.data).to.deep.eq(changedItem.data);

		const inserted = _.find(all, { name: 'test2' });

		expect(inserted.data).to.deep.eq(testItem2.data);
	});
});
