const { expect } = require('chai');
const Wallet = require('../../../src/main/models/wallet');
const db = require('../../utils/db');
describe('Wallet model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	it('create', () => {});

	it('findActive', () => {});

	it('findAll', () => {});

	it('findByPublicKey', () => {});

	it('updateProfilePicture', () => {});

	it('selectProfilePictureById', () => {});

	it('addInitialIdAttributesAndActivate', () => {});

	it('editImportedIdAttributes', () => {});
});
