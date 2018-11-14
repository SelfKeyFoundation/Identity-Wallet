import Repository from './repository';
import TestDb from '../db/test-db';
import fetch from 'node-fetch';
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
			statusCode: 200,
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
	describe('addAttribute', () => {});
	describe('deleteAttribute', () => {});
});
