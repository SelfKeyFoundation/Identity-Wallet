import TestDb from './main/db/test-db';

describe('Simple Spec', () => {
	beforeEach(async () => {
		await TestDb.init();
	});
	afterEach(async () => {
		await TestDb.reset();
	});
	// afterAll(async () => {
	// 	await TestDb.destroy();
	// });
	it('is a test', async () => {});
});
