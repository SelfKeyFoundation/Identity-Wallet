const { expect } = require('chai');
const Wallet = require('../../../src/main/models/wallet');

const db = require('../../utils/db');
describe('Wallet model', () => {
	const testItm = { publicKey: 'abc', keystoreFilePath: 'abcd' };

	const testItm2 = {
		publicKey: 'active',
		keystoreFilePath: 'active keystore',
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
		expect(itm).to.deep.contain(testItm);
		let setting = await itm.$relatedQuery('setting');
		// eslint-disable-next-line
		expect(setting).to.not.be.undefined;
		expect(setting.walletId).to.eq(itm.id);
	});

	it('findActive', async () => {
		await Wallet.query().insert(testItm);
		await Wallet.query().insert(testItm2);
		let found = await Wallet.findActive();
		expect(found.length).to.eq(1);
		expect(found[0].isSetupFinished).to.eq(1);
	});

	it('findAll', async () => {
		let found = await Wallet.findAll();
		expect(found.length).to.eq(0);
		await Wallet.query().insert(testItm);
		await Wallet.query().insert(testItm2);
		found = await Wallet.findAll();
		expect(found.length).to.eq(2);
	});

	it('findByPublicKey', async () => {
		await Wallet.query().insert(testItm);
		await Wallet.query().insert(testItm2);
		let found = await Wallet.findByPublicKey(testItm.publicKey);
		expect(found).to.deep.contain(testItm);
	});

	it('updateProfilePicture', async () => {
		let itm = await Wallet.query().insertAndFetch(testItm);
		// eslint-disable-next-line
		expect(itm.profilePicture).to.be.null;
		itm.profilePicture = 'supertest';
		itm.keystoreFilePath = 'change keystore';
		await Wallet.updateProfilePicture(itm);
		let check = await Wallet.query().findById(itm.id);
		expect(check.profilePicture).to.eq(itm.profilePicture);
		expect(check.keystoreFilePath).to.not.eq(itm.keystoreFilePath);
	});

	it('selectProfilePictureById', async () => {
		let itm = await Wallet.query().insertAndFetch({
			...testItm,
			profilePicture: 'test_profile_picture'
		});
		let selectedProfilePicture = await Wallet.selectProfilePictureById(itm.id);
		expect(selectedProfilePicture).to.eq('test_profile_picture');
	});

	it('addInitialIdAttributesAndActivate', async () => {
		const wallet = await Wallet.create(testItm);
		const initialized = await Wallet.addInitialIdAttributesAndActivate(
			wallet.id,
			initialAttributes
		);
		expect(initialized.id).to.eq(wallet.id);
		let attrs = await initialized.$relatedQuery('idAttributes');
		expect(attrs.length).to.be.gt(0);
	});

	it('editImportedIdAttributes', async () => {
		const wallet = await Wallet.create(testItm);
		const imported = await Wallet.editImportedIdAttributes(wallet.id, initialAttributes);
		expect(imported.id).to.eq(wallet.id);
		let attrs = await imported.$relatedQuery('idAttributes');
		expect(attrs.length).to.be.gt(0);
	});
});
