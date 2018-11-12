import JsonSchema from './json-schema';
import TestDb from '../db/test-db';

describe('JsonSchema model', () => {
	const testUiSchema = {
		url: 'http://test-url.com',
		attributeTypeId: 1,
		defaultRepositoryId: 1,
		content: {},
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
		const repo = await JsonSchema.query().insert(testUiSchema);
		expect(repo.id).toBeGreaterThan(0);
		const found = await JsonSchema.findById(repo.id);
		expect(repo).toEqual(found);
	});

	it('create', async () => {
		const repo = await JsonSchema.create(testUiSchema);
		const repo2 = await JsonSchema.create(testUiSchema);
		expect(repo.id).toBeGreaterThan(0);
		expect(repo2.id).toBeGreaterThan(0);
		expect(repo.id).not.toBe(repo2.id);
	});

	it('delete', async () => {
		const repo = await JsonSchema.query().insertAndFetch(testUiSchema);
		let found = await JsonSchema.query().findById(repo.id);
		expect(repo).toEqual(found);
		await JsonSchema.delete(repo.id);
		found = await JsonSchema.query().findById(repo.id);
		expect(found).toBeUndefined();
	});
});
