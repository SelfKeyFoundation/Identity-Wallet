const Wallet = require('../wallet');

const db = require('./utils/test-db');
describe('Wallet model', () => {
	const testItm = { publicKey: 'abc', keystoreFilePath: 'abcd' };

	const testItm2 = {
		publicKey: 'active',
		keystoreFilePath: 'active keystore',
		isSetupFinished: 1
	};

	const testItm3 = {
		publicKey: 'active',
		keystoreFilePath: '',
		isSetupFinished: 1
	};

	const initialAttributes = {
		country_of_residency: 'Algeria',
		first_name: 'test1',
		last_name: 'test1',
		middle_name: 'test1'
	};

	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		const itm = await Wallet.create(testItm);
		expect(itm).toMatchObject(testItm);
		let setting = await itm.$relatedQuery('setting');
		expect(setting).toBeDefined();
		expect(setting.walletId).toBe(itm.id);
	});

	it('findActive', async () => {
		await Wallet.query().insert(testItm);
		await Wallet.query().insert(testItm2);
		let found = await Wallet.findActive();
		expect(found.length).toBe(1);
		expect(found[0].isSetupFinished).toBe(1);
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
		await Wallet.query().insert(testItm); //with keyStore value
		await Wallet.query().insert(testItm3); // without keyStore value
		found = await Wallet.findAll();
		expect(found.length).toBe(1);
	});

	it('findByPublicKey', async () => {
		await Wallet.query().insert(testItm);
		await Wallet.query().insert(testItm2);
		let found = await Wallet.findByPublicKey(testItm.publicKey);
		expect(found).toMatchObject(testItm);
	});

	it('updateProfilePicture', async () => {
		let itm = await Wallet.query().insertAndFetch(testItm);
		expect(itm.profilePicture).toBeNull();
		itm.profilePicture = 'supertest';
		itm.keystoreFilePath = 'change keystore';
		await Wallet.updateProfilePicture(itm);
		let check = await Wallet.query().findById(itm.id);
		expect(check.profilePicture).toBe(itm.profilePicture);
		expect(check.keystoreFilePath).not.toBe(itm.keystoreFilePath);
	});

	it('selectProfilePictureById', async () => {
		let itm = await Wallet.query().insertAndFetch({
			...testItm,
			profilePicture: 'test_profile_picture'
		});
		let selectedProfilePicture = await Wallet.selectProfilePictureById(itm.id);
		expect(selectedProfilePicture).toBe('test_profile_picture');
	});

	it('addInitialIdAttributesAndActivate', async () => {
		const wallet = await Wallet.create(testItm);
		const initialized = await Wallet.addInitialIdAttributesAndActivate(
			wallet.id,
			initialAttributes
		);
		expect(initialized.id).toBe(wallet.id);
		let attrs = await initialized.$relatedQuery('idAttributes');
		expect(attrs.length).toBeGreaterThan(0);
	});

	it('editImportedIdAttributes', async () => {
		const wallet = await Wallet.create(testItm);
		const imported = await Wallet.editImportedIdAttributes(wallet.id, initialAttributes);
		expect(imported.id).toBe(wallet.id);
		let attrs = await imported.$relatedQuery('idAttributes');
		expect(attrs.length).toBeGreaterThan(0);
	});
});
