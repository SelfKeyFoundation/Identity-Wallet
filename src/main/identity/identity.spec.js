import Identity from './identity';
import TestDb from '../db/test-db';
import IdAttribute from './id-attribute';

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
		expect(check.profilePicture).toBe('data:;base64,supertes');
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
		expect(selectedProfilePicture).toBe('data:;base64,test/profile/picture');
	});

	it('create', async () => {
		const idnt = await Identity.create(testIdentity);
		const idnt2 = await Identity.create({
			...testIdentity,
			rootIdentity: false,
			positions: ['shareholder', 'director'],
			equity: 50.2
		});
		expect(idnt.id).toBeGreaterThan(0);
		expect(idnt2.id).toBeGreaterThan(0);
		expect(idnt.id).not.toBe(idnt2.id);
		expect(idnt.rootIdentity).toBe(true);
		expect(idnt.positions).toEqual([]);
		expect(idnt.equity).toBe(0);
		expect(idnt2.rootIdentity).toBe(false);
		expect(idnt2.positions).toEqual(['shareholder', 'director']);
		expect(idnt2.equity).toBe(50.2);
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

	it('delete with data', async () => {
		const testAttributes = [
			{
				name: 'test1',
				typeId: 1
			},
			{
				name: 'test2',
				typeId: 2,
				documents: [
					{
						name: 'doc1',
						mimeType: 'test1',
						size: 15,
						buffer: Buffer.from('test1')
					},
					{
						name: 'doc2',
						mimeType: 'test1',
						size: 15,
						buffer: Buffer.from('test2')
					}
				]
			},
			{
				name: 'test3',
				typeId: 3
			},
			{
				name: 'test4',
				typeId: 4
			}
		];

		const deleteTestIdentity = {
			type: 'corporate',
			name: 'test-delete',
			walletId: 1,
			attributes: testAttributes,
			members: [
				{
					type: 'corporate',
					name: 'test-member',
					walletId: 1,
					attributes: testAttributes,
					members: [
						{
							type: 'individual',
							name: 'test-member',
							walletId: 1,
							attributes: testAttributes,
							members: []
						}
					]
				},
				{
					type: 'individual',
					name: 'test-member1',
					walletId: 1,
					attributes: testAttributes
				}
			]
		};

		const identity = await Identity.query().insertGraphAndFetch(deleteTestIdentity);
		await Identity.delete(identity.id);

		let found = await Identity.query().findById(identity.id);
		expect(found).toBeUndefined();

		for (let member of identity.members) {
			found = await Identity.query().findById(member.id);
			expect(found).toBeUndefined();
		}

		for (let attr of identity.attributes) {
			found = await IdAttribute.query().findById(attr.id);
			expect(found).toBeUndefined();
		}
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
