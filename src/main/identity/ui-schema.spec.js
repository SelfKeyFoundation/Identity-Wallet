import UiSchema from './ui-schema';
import TestDb from '../db/test-db';

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
});
