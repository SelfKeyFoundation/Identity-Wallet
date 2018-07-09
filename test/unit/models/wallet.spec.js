const { expect } = require('chai');
const Wallet = require('../../../src/main/models/wallet');

const db = require('../../utils/db');
describe('Wallet model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		const testItm = { publicKey: 'abc', keystoreFilePath: 'abcd' };
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

	xit('addInitialIdAttributesAndActivate', () => {});

	xit('editImportedIdAttributes', () => {});
});
