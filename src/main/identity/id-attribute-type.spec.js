import _ from 'lodash';
import IdAttributeType from './id-attribute-type';
import TestDb from '../db/test-db';

describe('IdAttributeType model', () => {
	const testItem = {
		url: 'test',
		content: {},
		defaultRepositoryId: 1
	};
	const testItem2 = {
		url: 'test2',
		content: {},
		defaultRepositoryId: 1
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
		const expected = { ...testItem };
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
		expect(all.length).toBe(0);
		await IdAttributeType.create(testItem);
		await IdAttributeType.create(testItem2);
		all = await IdAttributeType.findAll();
		expect(all.length).toBe(2);
	});
	it('findByUrl', async () => {
		const attr = await IdAttributeType.query().insert(testItem);
		expect(attr.url).toBeDefined();
		const found = await IdAttributeType.findByUrl(attr.url);
		expect(attr).toEqual(found);
	});
});
