import _ from 'lodash';
import IdAttributeType from './id-attribute-type';
import TestDb from '../db/test-db';
import fetch from 'node-fetch';
import sinon from 'sinon';
jest.mock('node-fetch');

describe('IdAttributeType model', () => {
	const testItem = {
		url: 'test',
		content: {},
		expires: 0,
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
		sinon.restore();
		fetch.mockRestore();
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

	it('findById', async () => {
		const attrType = await IdAttributeType.query().insert(testItem);
		expect(attrType.id).toBeGreaterThan(0);
		const found = await IdAttributeType.findById(attrType.id);
		expect(attrType).toEqual(found);
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
		const attr = await IdAttributeType.query().insertAndFetch(testItem);
		expect(attr.url).toBeDefined();
		const found = await IdAttributeType.findByUrl(attr.url);
		expect(attr).toMatchObject(found);
	});

	it('loadRemote', async () => {
		let testScchema = {
			$id: 'https://test-url/id-attribute-type.json'
		};
		let testUrl = 'https://test-url/id-attribute-type.json';
		fetch.mockResolvedValue({
			statusCode: 200,
			json() {
				return testScchema;
			}
		});
		let res = await IdAttributeType.loadRemote(testUrl);

		expect(res.url).toBe(testUrl);
		expect(res.content).toEqual(testScchema);
	});

	describe('addRemote', () => {
		const remoteContent = {
			$id: 'http://platform.selfkey.org/schema/attribute/public-key.json',
			$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
			identityAttribute: true,
			identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
			title: 'Public Key',
			description: 'A cryptographic public key.',
			type: 'string'
		};
		const remoteIdAttribute = {
			url: 'http://test-url.com',
			defaultRepositoryId: 1,
			expires: Date.now() + 3000000,
			content: remoteContent
		};
		it('it should update id attribute type if it exists', async () => {
			let createdAttrType = await IdAttributeType.create({ url: 'http://test-url.com' });
			sinon.stub(IdAttributeType, 'loadRemote').resolves(remoteIdAttribute);
			await IdAttributeType.addRemote('http://test-url.com');
			let updatedAttrType = await IdAttributeType.findById(createdAttrType.id);
			expect(updatedAttrType.updatedAt).toBeGreaterThan(createdAttrType.updatedAt);
			expect(updatedAttrType.content).toEqual(remoteContent);
		});
		it('it should add new repo if it does not exists', async () => {
			let foundAttrType = await IdAttributeType.findByUrl(remoteIdAttribute.url);
			expect(foundAttrType).toBeUndefined();
			sinon.stub(IdAttributeType, 'loadRemote').resolves(remoteIdAttribute);
			await IdAttributeType.addRemote(remoteIdAttribute.url);
			let addedRepo = await IdAttributeType.findByUrl(remoteIdAttribute.url);
			expect(addedRepo.content).toEqual(remoteContent);
		});
	});
});
