// const { expect } = require('chai');
// const Wallet = require('../../../src/main/models/wallet');
const db = require('../../utils/db');
describe('Wallet model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	xit('create', () => {});

	xit('findActive', () => {});

	xit('findAll', () => {});

	xit('findByPublicKey', () => {});

	xit('updateProfilePicture', () => {});

	xit('selectProfilePictureById', () => {});

	xit('addInitialIdAttributesAndActivate', () => {});

	xit('editImportedIdAttributes', () => {});
});
