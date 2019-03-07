import UiSchema from './ui-schema';
import TestDb from '../db/test-db';
import fetch from 'node-fetch';
import sinon from 'sinon';
jest.mock('node-fetch');

describe('UiSchema model', () => {
	const testUiSchema = {
		url: 'http://test-url.com',
		attributeTypeId: 1,
		repositoryId: 1,
		content: {},
		expires: Date.now() + 20000
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
	it('findById', async () => {
		const repo = await UiSchema.query().insert(testUiSchema);
		expect(repo.id).toBeGreaterThan(0);
		const found = await UiSchema.findById(repo.id);
		expect(repo).toEqual(found);
	});

	it('findByUrl', async () => {
		const schema = await UiSchema.query().insert(testUiSchema);
		expect(schema.url).toBeDefined();
		const found = await UiSchema.findByUrl(schema.url, testUiSchema.repositoryId);
		expect(schema).toEqual(found);
	});

	it('create', async () => {
		const repo = await UiSchema.create(testUiSchema);
		const repo2 = await UiSchema.create(testUiSchema);
		expect(repo.id).toBeGreaterThan(0);
		expect(repo2.id).toBeGreaterThan(0);
		expect(repo.id).not.toBe(repo2.id);
	});

	it('delete', async () => {
		const repo = await UiSchema.query().insertAndFetch(testUiSchema);
		let found = await UiSchema.query().findById(repo.id);
		expect(repo).toEqual(found);
		await UiSchema.delete(repo.id);
		found = await UiSchema.query().findById(repo.id);
		expect(found).toBeUndefined();
	});

	it('loadRemote', async () => {
		let testScchema = {
			test: 'test'
		};
		let testUrl = 'https://test-url/ui-schema.json';
		fetch.mockResolvedValue({
			status: 200,
			json() {
				return testScchema;
			}
		});
		let res = await UiSchema.loadRemote(testUrl);

		expect(res.url).toBe(testUrl);
		expect(res.content).toEqual(testScchema);
	});

	describe('addRemote', () => {
		let testUrl = 'https://test-url/ui-schema.json';
		const remoteContent = {
			test: 'test'
		};
		const remoteUiSchema = {
			url: testUrl,
			expires: Date.now() + 3000000,
			content: remoteContent
		};
		it('it should update id attribute type if it exists', async () => {
			let createdUiSchemna = await UiSchema.create({
				url: testUrl,
				repositoryId: 1,
				attributeTypeId: 1
			});
			sinon.stub(UiSchema, 'loadRemote').resolves(remoteUiSchema);
			await UiSchema.addRemote(testUrl, 1);
			let updatedUiSchema = await UiSchema.findById(createdUiSchemna.id);
			expect(updatedUiSchema.updatedAt).toBeGreaterThan(createdUiSchemna.updatedAt);
			expect(updatedUiSchema.content).toEqual(remoteContent);
		});
		it('it should add new repo if it does not exists', async () => {
			let foundUiSchema = await UiSchema.findByUrl(remoteUiSchema.url, 1);
			expect(foundUiSchema).toBeUndefined();
			sinon.stub(UiSchema, 'loadRemote').resolves(remoteUiSchema);
			await UiSchema.addRemote(remoteUiSchema.url, 1, 1);
			let addedUiSchema = await UiSchema.findByUrl(remoteUiSchema.url, 1);
			expect(addedUiSchema.content).toEqual(remoteContent);
		});
	});
});
