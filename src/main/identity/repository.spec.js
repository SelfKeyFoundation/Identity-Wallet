import Repository from './repository';
import TestDb from '../db/test-db';

describe('Repository model', () => {
	const testRepo = {
		walletId: 0,
		name: 'test',
		url: 'http://test-url.com',
		eager: false,
		expires: Date.now() + 20000
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
});
