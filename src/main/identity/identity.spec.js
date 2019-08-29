import Identity from './identity';
import TestDb from '../db/test-db';

describe('Identity model', () => {
	const testIdentity = {
		name: 'test',
		walletId: 1,
		type: 'individual'
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
		const idnt = await Identity.query().insert(testIdentity);
		expect(idnt.id).toBeGreaterThan(0);
		const found = await Identity.findById(idnt.id);
		expect(idnt.name).toEqual(found.name);
	});

	it('updateProfilePicture', async () => {
		let itm = await Identity.query().insertAndFetch(testIdentity);
		expect(itm.profilePicture).toBeNull();
		itm.profilePicture = 'supertest';
		itm.keystoreFilePath = 'change keystore';
		await Identity.updateProfilePicture(itm);
		let check = await Identity.query().findById(itm.id);
		expect(check.profilePicture).toBe(itm.profilePicture);
	});

	it('updateSetup', async () => {
		let itm = await Identity.query().insertAndFetch(testIdentity);
		expect(itm.isSetupFinished).toEqual(false);
		itm.isSetupFinished = true;
		await Identity.updateSetup(itm);
		let check = await Identity.query().findById(itm.id);
		expect(check.isSetupFinished).toBe(true);
	});

	it('selectProfilePictureById', async () => {
		let itm = await Identity.query().insertAndFetch({
			...testIdentity,
			profilePicture: 'test_profile_picture'
		});
		let selectedProfilePicture = await Identity.selectProfilePictureById(itm.id);
		expect(selectedProfilePicture).toBe('test_profile_picture');
	});

	it('create', async () => {
		const idnt = await Identity.create(testIdentity);
		const idnt2 = await Identity.create(testIdentity);
		expect(idnt.id).toBeGreaterThan(0);
		expect(idnt2.id).toBeGreaterThan(0);
		expect(idnt.id).not.toBe(idnt2.id);
	});

	it('updateDID', async () => {
		let itm = await Identity.query().insertAndFetch(testIdentity);
		expect(itm.did).toBeNull();
		itm.did = 'did';
		await Identity.updateDID(itm);
		let check = await Identity.query().findById(itm.id);
		expect(check.did).toBe(itm.did);
	});

	it('delete', async () => {
		const idnt = await Identity.query().insertAndFetch(testIdentity);
		let found = await Identity.query().findById(idnt.id);
		expect(idnt).toEqual(found);
		await Identity.delete(idnt.id);
		found = await Identity.query().findById(idnt.id);
		expect(found).toBeUndefined();
	});

	it('findAllByWalletId', async () => {
		await Identity.create({
			walletId: 1,
			name: 'test1',
			type: 'individual'
		});
		await Identity.create({
			walletId: 2,
			name: 'test2',
			type: 'corporate'
		});
		await Identity.create({
			walletId: 1,
			name: 'test3',
			type: 'individual'
		});
		let idents = await Identity.findAllByWalletId(1);
		expect(idents.length).toBe(2);
		expect(idents[0].name).toBe('test1');
		expect(idents[1].name).toBe('test3');
		idents = await Identity.findAllByWalletId(2);
		expect(idents.length).toBe(1);
		expect(idents[0].name).toBe('test2');
	});
});
