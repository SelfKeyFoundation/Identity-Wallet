import _ from 'lodash';
import IdAttributeType from './id-attribute-type';
import initialAttributes from 'main/assets/data/initial-id-attribute-type-list.json';
import TestDb from '../db/test-db';

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
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});
	it('create', async () => {
		const expected = { ...testItem, type: 'static_data' };
		const itm = await IdAttributeType.create(testItem);
		expect(itm).toMatchObject(expected);
		expect(itm).toHaveProperty('createdAt');
		expect(itm).toHaveProperty('updatedAt');

		const itm2 = await IdAttributeType.create(testItem2);
		expect(itm2).toMatchObject(_.omit(testItem2, 'isInitial'));
		expect(itm2).toHaveProperty('createdAt');
		expect(itm2).toHaveProperty('updatedAt');
	});

	it('findAll', async () => {
		let all = await IdAttributeType.findAll();
		expect(all.length).toBe(initialAttributes.length);
		await IdAttributeType.create(testItem);
		await IdAttributeType.create(testItem2);
		all = await IdAttributeType.findAll();
		expect(all.length).toBe(initialAttributes.length + 2);
	});

	it('findInitial', async () => {
		let all = await IdAttributeType.findInitial();
		expect(all.length).toBe(initialAttributes.length);
		await IdAttributeType.create(testItem);
		await IdAttributeType.create(testItem2);
		all = await IdAttributeType.findInitial();
		expect(all.length).toBe(initialAttributes.length);
	});

	it('import', async () => {
		const toImport = [
			{
				key: 'test',
				category: 'test_category',
				type: ['static_data'],
				entity: ['individual', 'company'],
				isInitial: 0
			},
			{
				key: 'test2',
				category: 'test_category2',
				type: 'document',
				entity: ['individual', 'company'],
				isInitial: 1
			}
		];
		const itm = await IdAttributeType.create(testItem);
		let all = await IdAttributeType.query();

		await IdAttributeType.import(toImport);

		let allAfterImport = await IdAttributeType.query();
		expect(allAfterImport.length).toBe(all.length + 1);
		const updatedItm = await IdAttributeType.query().findById(itm.key);
		expect(itm.entity.length).not.toBe(updatedItm.entity.length);
	});
});
