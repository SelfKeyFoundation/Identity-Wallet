const { expect } = require('chai');
const _ = require('lodash');
const IdAttributeType = require('../../../src/main/models/id-attribute-type');
const db = require('../../utils/db');
const initialAttributes = require('../../../src/main/assets/data/initial-id-attribute-type-list.json');

describe('IdAttributeType model', () => {
	const testItem = {
		key: 'test',
		category: 'test_category',
		type: ['static_data'],
		entity: ['individual'],
		isInitial: 0
	};
	const testItem2 = {
		key: 'test2',
		category: 'test_category2',
		type: 'document',
		entity: ['individual', 'company'],
		isInitial: 1
	};
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		const expected = { ...testItem, type: 'static_data' };
		const itm = await IdAttributeType.create(testItem);
		expect(itm).to.deep.contain(expected);
		// eslint-disable-next-line no-unused-expressions
		expect(itm.createdAt).to.exist;
		// eslint-disable-next-line no-unused-expressions
		expect(itm.updatedAt).to.exist;

		const itm2 = await IdAttributeType.create(testItem2);
		expect(itm2).to.deep.contain(_.omit(testItem2, 'isInitial'));
		// eslint-disable-next-line no-unused-expressions
		expect(itm2.createdAt).to.exist;
		// eslint-disable-next-line no-unused-expressions
		expect(itm2.updatedAt).to.exist;
	});

	it('findAll', async () => {
		let all = await IdAttributeType.findAll();
		expect(all.length).to.eq(initialAttributes.length);
		await IdAttributeType.create(testItem);
		await IdAttributeType.create(testItem2);
		all = await IdAttributeType.findAll();
		expect(all.length).to.eq(initialAttributes.length + 2);
	});

	it('findInitial', async () => {
		let all = await IdAttributeType.findInitial();
		expect(all.length).to.eq(initialAttributes.length);
		await IdAttributeType.create(testItem);
		await IdAttributeType.create(testItem2);
		all = await IdAttributeType.findInitial();
		expect(all.length).to.eq(initialAttributes.length);
	});

	xit('import', () => {});
});
