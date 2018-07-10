const { expect } = require('chai');
const Wallet = require('../../../src/main/models/wallet');

const db = require('../../utils/db');
describe('Wallet model', () => {
	const testItm = { publicKey: 'abc', keystoreFilePath: 'abcd' };
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

	xit('findActive', () => {});

	xit('findAll', () => {});

	xit('findByPublicKey', () => {});

	xit('updateProfilePicture', () => {});

	xit('selectProfilePictureById', () => {});

	it('addInitialIdAttributesAndActivate', async () => {
		const initial = {
			country_of_residency: 'Algeria',
			first_name: 'test1',
			last_name: 'test1',
			middle_name: 'test1'
		};
		const wallet = await Wallet.create(testItm);
		const initialized = await Wallet.addInitialIdAttributesAndActivate(wallet.id, initial);
		expect(initialized.id).to.eq(wallet.id);
	});

	xit('editImportedIdAttributes', () => {});
});
