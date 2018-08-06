import IdAttribute from './id-attribute';
import Document from './document';
import Wallet from '../wallet/wallet';
import db from '../db/test-db';

describe('IdAttribute model', () => {
	const testWalletId = 1;
	const testStaticData = { test: 'test_data' };
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
		let attr = await IdAttribute.create(testWalletId, 'test_key', testStaticData);
		expect(attr.id).toBeGreaterThan(0);
		expect(attr.walletId).toBe(testWalletId);
		expect(attr.createdAt).toBeGreaterThan(0);
		expect(attr.updatedAt).toBeGreaterThan(0);
		expect(attr.items.length).toBeGreaterThan(0);
		let item = attr.items[0];
		expect(item.values.length).toBeGreaterThan(0);
		let value = item.values[0];
		expect(value.staticData).toEqual(testStaticData);
		try {
			await IdAttribute.create(testWalletId, 'test_key', testStaticData);
			throw new Error('Assertion Error, should have thrown');
		} catch (error) {
			expect(error instanceof Error).toBe(true);
		}
		attr = await IdAttribute.create(testWalletId, 'test_key2', testStaticData, testDoc);
		expect(attr.id).toBeGreaterThan(0);
		expect(attr.walletId).toBe(testWalletId);
		expect(attr.createdAt).toBeGreaterThan(0);
		expect(attr.updatedAt).toBeGreaterThan(0);
		expect(attr.items.length).toBeGreaterThan(0);
		item = attr.items[0];
		expect(item.values.length).toBeGreaterThan(0);
		value = item.values[0];
		expect(value.staticData).toEqual(testStaticData);
		// eslint-disable-next-line
		expect(value.documentId).toBeDefined();
		// eslint-disable-next-line
		expect(value.documentName).toBeDefined();
		try {
			await IdAttribute.create(testWalletId, 'test_key', testStaticData);
			throw new Error('Assertion Error, should have thrown');
		} catch (error) {
			expect(error instanceof Error).toBe(true);
		}
	});

	it('addEditDocumentToIdAttributeItemValue', async () => {
		let attr = await IdAttribute.create(testWalletId, 'test', testStaticData);
		let item = attr.items[0];
		let value = item.values[0];
		// eslint-disable-next-line
		expect(value.documentName).toBeUndefined();
		// eslint-disable-next-line
		expect(value.documentId).toBeUndefined();
		let updatedAttr = await IdAttribute.addEditDocumentToIdAttributeItemValue(
			attr.id,
			item.id,
			value.id,
			testDoc
		);
		item = updatedAttr.items[0];
		value = item.values[0];
		// eslint-disable-next-line
		expect(value.documentName).toBeDefined();
		// eslint-disable-next-line
		expect(value.documentId).toBeDefined();
	});

	it('addEditStaticDataToIdAttributeItemValue', async () => {
		let attr = await IdAttribute.create(testWalletId, 'test', testStaticData);
		let item = attr.items[0];
		let value = item.values[0];
		expect(value.staticData).toEqual(testStaticData);
		const modifiedStaticData = { modified: 'data' };
		let updatedAttr = await IdAttribute.addEditStaticDataToIdAttributeItemValue(
			attr.id,
			item.id,
			value.id,
			modifiedStaticData
		);
		item = updatedAttr.items[0];
		value = item.values[0];
		expect(value.staticData).toEqual(modifiedStaticData);
	});

	it('findAllByWalletId', async () => {
		let attr1 = await IdAttribute.create(testWalletId, 'test', testStaticData);
		let attr2 = await IdAttribute.create(testWalletId, 'test2', testStaticData);
		let all = await IdAttribute.findAllByWalletId(testWalletId);

		expect(all).toEqual({
			[attr1.id]: attr1,
			[attr2.id]: attr2
		});
	});

	it('delete', async () => {
		let attr = await IdAttribute.create(testWalletId, 'test', testStaticData, testDoc);
		let item = attr.items[0];
		let value = item.values[0];
		let doc = await Document.findById(value.documentId);
		expect(doc.id).toBe(value.documentId);
		await IdAttribute.delete(attr.id, item.id, value.id);
		doc = await Document.findById(value.documentId);
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
