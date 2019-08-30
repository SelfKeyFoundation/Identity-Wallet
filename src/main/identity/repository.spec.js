import Repository from './repository';
import TestDb from '../db/test-db';
import fetch from 'node-fetch';
import sinon from 'sinon';
import { UiSchema } from './ui-schema';
import { IdAttribute } from './id-attribute';
import { IdAttributeType } from './id-attribute-type';
jest.mock('node-fetch');

describe('Repository model', () => {
	const testRepo = {
		name: 'test',
		url: 'http://test-url.com',
		eager: false,
		content: {},
		expires: Date.now() + 20000
	};
	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
		fetch.mockRestore();
		sinon.restore();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});
	it('findById', async () => {
		const repo = await Repository.query().insert(testRepo);
		expect(repo.id).toBeGreaterThan(0);
		const found = await Repository.findById(repo.id);
		expect(repo).toEqual(found);
	});
	it('findByUrl', async () => {
		const repo = await Repository.query().insert(testRepo);
		expect(repo.url).toBeDefined();
		const found = await Repository.findByUrl(repo.url);
		expect(repo).toEqual(found);
	});
	it('create', async () => {
		const repo = await Repository.create(testRepo);
		const repo2 = await Repository.create(testRepo);
		expect(repo.id).toBeGreaterThan(0);
		expect(repo2.id).toBeGreaterThan(0);
		expect(repo.id).not.toBe(repo2.id);
	});
	it('delete', async () => {
		const repo = await Repository.query().insertAndFetch(testRepo);
		let found = await Repository.query().findById(repo.id);
		expect(repo).toEqual(found);
		await Repository.delete(repo.id);
		found = await Repository.query().findById(repo.id);
		expect(found).toBeUndefined();
	});

	it('findAll', async () => {
		let res = await Repository.findAll();
		expect(res.length).toEqual(1);

		await Repository.query().insertAndFetch(testRepo);
		await Repository.query().insertAndFetch(testRepo);
		await Repository.query().insertAndFetch(testRepo);

		res = await Repository.findAll();

		expect(res.length).toEqual(4);
	});

	it('loadRemote', async () => {
		let testRepo = {
			name: 'test',
			idAttributes: []
		};
		let testUrl = 'https://test-url/repository.json';
		fetch.mockResolvedValue({
			status: 200,
			json() {
				return testRepo;
			}
		});
		let res = await Repository.loadRemote(testUrl);

		expect(res.url).toBe(testUrl);
		expect(res.content).toEqual(testRepo);
		expect(res.name).toEqual(testRepo.name);
	});

	describe('diffAttributes', () => {
		let existingRepo = null;
		let repo = {
			id: 2,
			url: 'http://test-url/repository.json',
			expires: 30000,
			content: {
				identityAttributes: [
					{
						ui: 'http://test-url/id-attribute-ui1.json',
						json: 'http://test-url/id-attribute1.json'
					},
					{
						ui: 'http://test-url/id-attribute-ui2.json',
						json: 'http://test-url/id-attribute2.json'
					},
					{
						ui: 'http://test-url/id-attribute-ui3.json',
						json: 'http://test-url/id-attribute3.json'
					},
					'http://test-url/id-attribute4.json'
				]
			}
		};

		beforeEach(() => {
			existingRepo = Repository.fromJson(repo);
		});

		it('should add new identity attribute types', () => {
			let incomingRepo = {
				...repo,
				content: {
					...repo.content,
					identityAttributes: [
						...repo.content.identityAttributes,
						{
							ui: 'http://test-url/id-attribute-ui5.json',
							json: 'http://test-url/id-attribute5.json'
						}
					]
				}
			};

			let importValues = existingRepo.diffAttributes(incomingRepo);
			expect(importValues).toEqual({
				delete: [],
				add: [
					{
						ui: 'http://test-url/id-attribute-ui5.json',
						json: 'http://test-url/id-attribute5.json'
					}
				]
			});
		});
		it('should delete identity attribute types', async () => {
			let incomingRepo = {
				...repo,
				content: {
					...repo.content,
					identityAttributes: [...repo.content.identityAttributes]
				}
			};
			incomingRepo.content.identityAttributes.splice(2, 1);
			let importValues = existingRepo.diffAttributes(incomingRepo);
			expect(importValues).toEqual({
				delete: [
					{
						ui: 'http://test-url/id-attribute-ui3.json',
						json: 'http://test-url/id-attribute3.json'
					}
				],
				add: []
			});
		});
		it('should update  identity attribute types', async () => {
			let incomingRepo = {
				...repo,
				content: {
					...repo.content,
					identityAttributes: [...repo.content.identityAttributes]
				}
			};
			delete incomingRepo.content.identityAttributes[2].ui;
			incomingRepo.content.identityAttributes[1].ui = 'http://new-test/ui.json';
			let importValues = existingRepo.diffAttributes(incomingRepo);
			expect(importValues).toEqual({
				delete: [
					{
						ui: 'http://test-url/id-attribute-ui2.json'
					},
					{
						ui: 'http://test-url/id-attribute-ui3.json'
					}
				],
				add: [
					{
						ui: 'http://new-test/ui.json',
						json: 'http://test-url/id-attribute2.json'
					}
				]
			});
		});
	});
	describe('updateAttributes', () => {
		let repo = Repository.fromJson({
			id: 2,
			url: 'http://test-url/repository.json',
			expires: 30000,
			content: {}
		});

		it('should add new attributes ', async () => {
			sinon.stub(repo, 'addAttribute').resolves('ok');
			await repo.updateAttributes({ add: [{ test: 'test1' }, { test: 'test2' }] });
			expect(repo.addAttribute.calledTwice).toBeTruthy();
		});
		it('it should delete new attributes', async () => {
			sinon.stub(repo, 'deleteAttribute').resolves('ok');
			await repo.updateAttributes({ delete: [{ test: 'test1' }, { test: 'test2' }] });
			expect(repo.deleteAttribute.calledTwice).toBeTruthy();
		});
	});
	describe('addAttribute', () => {
		it('should add attribute and schema', async () => {
			let repo = await Repository.findById(1);
			let attr = {
				json: 'http://test-url/schema.json',
				ui: 'http://test-url/ui.json'
			};
			await repo.addAttribute(attr);

			let uiSchema = await UiSchema.findByUrl(attr.ui, repo.id).eager(
				'[idAttributeType, repository]'
			);

			expect(uiSchema.url).toEqual(attr.ui);
			expect(uiSchema.idAttributeType.url).toEqual(attr.json);
			expect(uiSchema.repository.id).toEqual(repo.id);
		});
		it('should not create new identity attribute if it exists in other repo', async () => {
			let repo1 = await Repository.findById(1);
			let repo2 = await Repository.create({
				url: 'http://test-url/repository.json'
			});
			expect(repo1.id).not.toEqual(repo2.id);
			await repo1.addAttribute('http://test-url/schema.json');

			let attrCreated = await IdAttributeType.findByUrl('http://test-url/schema.json');
			expect(attrCreated).toBeDefined();

			await repo2.addAttribute({
				json: 'http://test-url/schema.json',
				ui: 'http://test-url/ui.json'
			});

			await repo2.$loadRelated('attributeTypes');

			let repo2Attr = repo2.attributeTypes.filter(
				attr => attr.url === 'http://test-url/schema.json'
			);

			expect(repo2Attr.length).toBe(1);
			expect(repo2Attr[0].id).toBe(attrCreated.id);
		});
		it('should create new ui schema even if attribute exists in a different repo', async () => {
			let repo1 = await Repository.findById(1);
			let repo2 = await Repository.create({
				url: 'http://test-url/repository.json'
			});
			expect(repo1.id).not.toEqual(repo2.id);
			await repo1.addAttribute({
				json: 'http://test-url/schema.json',
				ui: 'http://test-url/ui1.json'
			});

			let attrCreated = await IdAttributeType.findByUrl('http://test-url/schema.json');
			expect(attrCreated).toBeDefined();

			await repo2.addAttribute({
				json: 'http://test-url/schema.json',
				ui: 'http://test-url/ui2.json'
			});

			await attrCreated.$loadRelated('uiSchemas');

			expect(attrCreated.uiSchemas.length).toBe(2);
			expect(attrCreated.uiSchemas[0].id).not.toBe(attrCreated.uiSchemas[1].id);
		});
	});
	describe('deleteAttribute', () => {
		it('id attribure type with no other attached repos and no id attributes should be deleted', async () => {
			let repo1 = await Repository.findById(1);
			let attr = {
				json: 'http://test-url/schema.json',
				ui: 'http://test-url/ui1.json'
			};
			await repo1.addAttribute(attr);
			await repo1.deleteAttribute(attr);

			expect(await IdAttributeType.findByUrl(attr.json)).toBeUndefined();
			expect(await UiSchema.findByUrl(attr.ui, repo1.id)).toBeUndefined();
		});
		it('id attribute type with no other attached repos but with attributes should be redirected to null repo', async () => {
			let repo1 = await Repository.findById(1);
			let attr = {
				json: 'http://test-url/schema.json',
				ui: 'http://test-url/ui1.json'
			};
			await repo1.addAttribute(attr);
			let attrType = await IdAttributeType.findByUrl(attr.json);
			await IdAttribute.create({
				identityId: 1,
				typeId: attrType.id
			});
			await repo1.deleteAttribute(attr);
			attrType = await IdAttributeType.findByUrl(attr.json);
			expect(attrType).toBeDefined();
			expect(await UiSchema.findByUrl(attr.ui, repo1.id)).toBeUndefined();
		});
	});
	describe('addRemoteRepo', () => {
		const remoteContent = {
			name: 'test',
			identityAttributes: [
				{
					ui: 'http://test-url/id-attribute-ui1.json',
					json: 'http://test-url/id-attribute1.json'
				},
				{
					ui: 'http://test-url/id-attribute-ui2.json',
					json: 'http://test-url/id-attribute2.json'
				},
				{
					ui: 'http://test-url/id-attribute-ui3.json',
					json: 'http://test-url/id-attribute3.json'
				},
				'http://test-url/id-attribute4.json'
			]
		};
		const remoteRepo = {
			url: 'http://test-url.com',
			name: 'test',
			expires: Date.now() + 3000000,
			content: remoteContent
		};
		it('it should update repo if it exists', async () => {
			let createdRepo = await Repository.create(testRepo);
			sinon.stub(Repository, 'loadRemote').resolves(remoteRepo);
			await Repository.addRemoteRepo(testRepo.url);
			let updatedRepo = await Repository.findById(createdRepo.id).eager(
				'[uiSchemas, attributeTypes]'
			);
			expect(updatedRepo.updatedAt).toBeGreaterThan(createdRepo.updatedAt);
			expect(updatedRepo.content).toEqual(remoteContent);
			expect(updatedRepo.name).toEqual(remoteContent.name);
			expect(updatedRepo.uiSchemas.length).toBe(3);
			expect(updatedRepo.attributeTypes.length).toBe(4);
		});
		it('it should add new repo if it does not exists', async () => {
			let foundRepo = await Repository.findByUrl(testRepo.url);
			expect(foundRepo).toBeUndefined();
			sinon.stub(Repository, 'loadRemote').resolves(remoteRepo);
			await Repository.addRemoteRepo(testRepo.url);
			let addedRepo = await Repository.findByUrl(testRepo.url).eager(
				'[uiSchemas, attributeTypes]'
			);
			expect(addedRepo.content).toEqual(remoteContent);
			expect(addedRepo.name).toEqual(remoteContent.name);
			expect(addedRepo.attributeTypes.length).toBe(4);
			expect(addedRepo.uiSchemas.length).toBe(3);
		});
	});
});
