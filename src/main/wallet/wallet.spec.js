import Wallet from './wallet';
import TestDb from '../db/test-db';

describe('Wallet model', () => {
	const testItm = { address: 'abc', keystoreFilePath: 'abcd' };

	const testItm2 = {
		address: 'active',
		keystoreFilePath: 'active keystore'
	};

	const testItm3 = {
		address: 'public-key-1'
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
		const itm = await Wallet.create(testItm);
		expect(itm).toMatchObject(testItm);
		let setting = await itm.$relatedQuery('setting');
		expect(setting).toBeDefined();
		expect(setting.walletId).toBe(itm.id);
	});

	it('findAll', async () => {
		let found = await Wallet.findAll();
		expect(found.length).toBe(0);
		await Wallet.query().insert(testItm);
		await Wallet.query().insert(testItm2);
		await Wallet.query().insert(testItm3);
		found = await Wallet.findAll();
		expect(found.length).toBe(3);
	});

	it('findAllWithKeyStoreFile', async () => {
		let found = await Wallet.findAllWithKeyStoreFile();
		expect(found.length).toBe(0);
		await Wallet.query().insert(testItm); // with keyStore value
		await Wallet.query().insert(testItm3); // without keyStore value
		found = await Wallet.findAllWithKeyStoreFile();
		expect(found.length).toBe(1);
	});

	it('findByPublicKey', async () => {
		await Wallet.query().insert(testItm);
		await Wallet.query().insert(testItm2);
		let found = await Wallet.findByPublicKey(testItm.address);
		expect(found).toMatchObject(testItm);
	});

	it('updateName', async () => {
		let itm = await Wallet.query().insertAndFetch(testItm);
		expect(itm.name).toBeNull();
		itm.name = 'name';
		await Wallet.updateName(itm);
		let check = await Wallet.query().findById(itm.id);
		expect(check.name).toBe(itm.name);
	});

	describe('hasSignedUpTo', () => {
		const testLoginAttempt = {
			walletId: 10,
			websiteName: 'Test Website',
			websiteUrl: 'https://example.com',
			apiUrl: 'https://example.com/v1/api',
			success: true,
			signup: true
		};
		const testWallet = { id: 10, address: 'public' };
		let wallet = null;
		beforeEach(async () => {
			wallet = await Wallet.query().insertAndFetch(testWallet);
		});
		it('returns false if no attempts', async () => {
			let hasSignedUp = await wallet.hasSignedUpTo(testLoginAttempt.websiteUrl);
			expect(hasSignedUp).toBe(false);
		});
		it('returns false if no signup', async () => {
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, signup: false });
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, signup: false });
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, signup: false });
			let hasSignedUp = await wallet.hasSignedUpTo(testLoginAttempt.websiteUrl);
			expect(hasSignedUp).toBe(false);
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, websiteUrl: 'https://other-example.com' });
			expect(hasSignedUp).toBe(false);
		});
		it('returns false if signed up with error', async () => {
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, errorCode: 'test' });
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, signup: false });
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, signup: false });
			let hasSignedUp = await wallet.hasSignedUpTo(testLoginAttempt.websiteUrl);
			expect(hasSignedUp).toBe(false);
		});
		it('returns true if signed up successfully', async () => {
			await wallet.$relatedQuery('loginAttempts').insert({ ...testLoginAttempt });
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, signup: false });
			await wallet
				.$relatedQuery('loginAttempts')
				.insert({ ...testLoginAttempt, signup: false });
			let hasSignedUp = await wallet.hasSignedUpTo(testLoginAttempt.websiteUrl);
			expect(hasSignedUp).toBe(true);
		});
	});
	describe('addLoginAttempt', () => {
		const testLoginAttempt = {
			walletId: 10,
			websiteName: 'Test Website',
			websiteUrl: 'https://example.com',
			apiUrl: 'https://example.com/v1/api',
			success: true,
			signup: true
		};
		const testWallet = { id: 10, address: 'public' };
		it('adds a new login attempt', async () => {
			let wallet = await Wallet.query().insertAndFetch(testWallet);
			await wallet.addLoginAttempt({ ...testLoginAttempt });
			wallet = await Wallet.query()
				.findById(wallet.id)
				.eager('loginAttempts');
			expect(wallet.loginAttempts).toBeDefined();
			expect(wallet.loginAttempts.length).toBe(1);
		});
	});
});
