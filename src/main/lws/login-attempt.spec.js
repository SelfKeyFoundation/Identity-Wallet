import { LoginAttempt } from './login-attempt';

import TestDb from '../db/test-db';

describe('LoginAttempt', () => {
	const testLoginAttempt = {
		walletId: 10,
		websiteName: 'Test Website',
		websiteUrl: 'https://example.com',
		apiUrl: 'https://example.com/v1/api',
		success: true,
		errorCode: 'test_error',
		errorMessage: 'A test error has occured',
		signup: true
	};
	const testWallet = { id: 10, address: 'public' };
	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});
	it('sanity', async () => {
		expect(LoginAttempt).toBeDefined();
		await LoginAttempt.query().insert(testLoginAttempt);
		let search = await LoginAttempt.query().select();
		expect(search.length).toBe(1);
		expect(search[0]).toMatchObject(testLoginAttempt);
	});
	it('relations', async () => {
		const testAttemptWithRelation = { ...testLoginAttempt, wallet: testWallet };
		let attempt = await LoginAttempt.query().insertGraph(testAttemptWithRelation);
		attempt = await LoginAttempt.query()
			.findById(attempt.id)
			.eager('wallet');
		expect(attempt.wallet).toBeDefined();
		expect(attempt.wallet.id).toBe(testAttemptWithRelation.wallet.id);
	});
});
