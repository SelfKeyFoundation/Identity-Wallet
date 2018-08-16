import IdAttribute from './id-attribute';
import Document from './document';
import Wallet from '../wallet/wallet';
import TestDb from '../db/test-db';

describe('IdAttribute model', () => {
	let db;
	beforeAll(async () => {
		db = new TestDb();
		await db.init();
	});
	afterAll(async () => {
		await db.destroy();
	});
	const testWalletId = 1;
	const testAttribute = { walletId: testWalletId, type: 'test_data', data: { value: 'test' } };
	const testAttributeComplex = {
		walletId: testWalletId,
		type: 'test_data2',
		data: { testDate1: 'testdata' }
	};
	const testDoc = {
		name: 'test',
		mimeType: 'test-mime',
		size: 100,
		buffer: Buffer.alloc(100)
	};
	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		let all = await IdAttribute.query().where({ walletId: testWalletId });
		expect(all.length).toBe(0);
		let attr = await IdAttribute.create(testAttribute);
		expect(attr.id).toBeGreaterThan(0);
		expect(attr.walletId).toBe(testWalletId);
		expect(attr.createdAt).toBeGreaterThan(0);
		expect(attr.updatedAt).toBeGreaterThan(0);
		expect(attr.value).toEqual(testAttribute.value);
		attr = await IdAttribute.create(testAttributeComplex);
		expect(attr.value).toEqual(testAttribute.value);
		attr = await IdAttribute.create({ ...testAttribute, document: testDoc });
		expect(attr.id).toBeGreaterThan(0);
		expect(attr.documentId).not.toBeNull();
		expect(attr.walletId).toBe(testWalletId);
		expect(attr.createdAt).toBeGreaterThan(0);
		expect(attr.updatedAt).toBeGreaterThan(0);
		expect(attr.value).toEqual(testAttribute.value);
		expect(attr.documentId).not.toBeNull();
		expect(attr.document).not.toBeNull();
	});

	it('addDocument', async () => {
		let attr = await IdAttribute.create(testAttribute);
		expect(attr.documentId).toBeNull();
		let updatedAttr = await IdAttribute.addDocument(attr.id, testDoc);
		expect(updatedAttr.documentId).not.toBeNull();
		let oldDocId = updatedAttr.documentId;
		updatedAttr = await IdAttribute.addDocument(attr.id, testDoc);
		expect(updatedAttr.documentId).not.toBe(oldDocId);
		let doc = await Document.findById(oldDocId);
		expect(doc).toBeUndefined();
	});

	it('addData', async () => {
		let attr = await IdAttribute.create(testAttributeComplex);
		expect(attr.data).toEqual(testAttributeComplex.data);
		const modifiedStaticData = { modified: 'data' };
		let updatedAttr = await IdAttribute.addData(attr.id, modifiedStaticData);
		expect(updatedAttr.data).toEqual(modifiedStaticData);
	});

	it('findAllByWalletId', async () => {
		let attr1 = await IdAttribute.create(testAttribute);
		let attr2 = await IdAttribute.create(testAttributeComplex);
		let all = await IdAttribute.findAllByWalletId(testWalletId);
		expect(all).toEqual([attr1, attr2]);
	});

	it('delete', async () => {
		let attr = await IdAttribute.create({ ...testAttribute, document: testDoc });
		let doc = await Document.findById(attr.documentId);
		expect(doc.id).toBe(attr.documentId);
		await IdAttribute.delete(attr.id);
		doc = await Document.findById(attr.documentId);
		// eslint-disable-next-line
		expect(doc).toBeUndefined();
		attr = await IdAttribute.query().findById(attr.id);
		// eslint-disable-next-line
		expect(attr).toBeUndefined();
	});

	it('addImportedIdAttributes', async () => {
		const wallet = await Wallet.create({ id: testWalletId, publicKey: 'abc' });
		const exportCode = 123;
		const reqDoc = [
			{
				attributeType: 'national_id',
				docs: [
					{
						fileItems: [
							{
								...testDoc,
								name: 'test_name_1'
							},
							{
								...testDoc,
								name: 'test_name_2'
							}
						]
					},
					{
						fileItems: [
							{
								...testDoc,
								name: 'test_name_3'
							}
						]
					}
				]
			},
			{
				attributeType: 'internaional_id',
				docs: [
					{
						fileItems: [
							{
								...testDoc,
								name: 'test_name_4'
							},
							{
								...testDoc,
								name: 'test_name_5'
							}
						]
					},
					{
						fileItems: [
							{
								...testDoc,
								name: 'test_name_6'
							}
						]
					}
				]
			}
		];
		const reqStatic = [
			{
				attributeType: 'phone',
				staticData: ['test1', 'test2', 'test3']
			},
			{
				attributeType: 'last_name',
				staticData: ['test4', 'test5', 'test6']
			}
		];
		await IdAttribute.addImportedIdAttributes(wallet.id, exportCode, reqDoc, reqStatic);
		let attrs = await IdAttribute.query().where({ walletId: wallet.id });
		expect(attrs.length).toBeGreaterThan(0);
	});

	it('genInitial', async () => {
		const initial = {
			country_of_residency: 'Algeria',
			first_name: 'test1',
			last_name: 'test1',
			middle_name: 'test1'
		};
		let attrs = await IdAttribute.genInitial(testWalletId, initial);

		expect(attrs.length).toBeGreaterThan(0);
	});

	it('initializeImported', async () => {
		const initial = {
			country_of_residency: 'Algeria',
			first_name: 'test1',
			last_name: 'test1',
			middle_name: 'test1'
		};
		const wallet = await Wallet.create({ id: testWalletId, publicKey: 'abc' });
		let attrs = await IdAttribute.initializeImported(wallet.id, initial);
		expect(attrs.length).toBeGreaterThan(0);
	});
});
