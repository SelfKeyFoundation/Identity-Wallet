const { expect } = require('chai');
const IdAttribute = require('../../../src/main/models/id-attribute');
const Document = require('../../../src/main/models/document');
const Wallet = require('../../../src/main/models/wallet');

const db = require('../../utils/db');
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
		expect(all.length).to.eq(0);
		let attr = await IdAttribute.create(testWalletId, 'test_key', testStaticData);
		expect(attr.id).to.be.gt(0);
		expect(attr.walletId).to.eq(testWalletId);
		expect(attr.createdAt).to.be.gt(0);
		expect(attr.updatedAt).to.be.gt(0);
		expect(attr.items.length).to.be.gt(0);
		let item = attr.items[0];
		expect(item.values.length).to.be.gt(0);
		let value = item.values[0];
		expect(value.staticData).to.deep.eq(testStaticData);
		try {
			await IdAttribute.create(testWalletId, 'test_key', testStaticData);
			throw new Error('Assertion Error, should have thrown');
		} catch (error) {
			expect(error instanceof Error).to.eq(true);
		}
		attr = await IdAttribute.create(testWalletId, 'test_key2', testStaticData, testDoc);
		expect(attr.id).to.be.gt(0);
		expect(attr.walletId).to.eq(testWalletId);
		expect(attr.createdAt).to.be.gt(0);
		expect(attr.updatedAt).to.be.gt(0);
		expect(attr.items.length).to.be.gt(0);
		item = attr.items[0];
		expect(item.values.length).to.be.gt(0);
		value = item.values[0];
		expect(value.staticData).to.deep.eq(testStaticData);
		// eslint-disable-next-line
		expect(value.documentId).to.not.be.undefined;
		// eslint-disable-next-line
		expect(value.documentName).to.not.be.undefined;
		try {
			await IdAttribute.create(testWalletId, 'test_key', testStaticData);
			throw new Error('Assertion Error, should have thrown');
		} catch (error) {
			expect(error instanceof Error).to.eq(true);
		}
	});

	it('addEditDocumentToIdAttributeItemValue', async () => {
		let attr = await IdAttribute.create(testWalletId, 'test', testStaticData);
		let item = attr.items[0];
		let value = item.values[0];
		// eslint-disable-next-line
		expect(value.documentName).to.be.undefined;
		// eslint-disable-next-line
		expect(value.documentId).to.be.undefined;
		let updatedAttr = await IdAttribute.addEditDocumentToIdAttributeItemValue(
			attr.id,
			item.id,
			value.id,
			testDoc
		);
		item = updatedAttr.items[0];
		value = item.values[0];
		// eslint-disable-next-line
		expect(value.documentName).to.not.be.undefined;
		// eslint-disable-next-line
		expect(value.documentId).to.not.be.undefined;
	});

	it('addEditStaticDataToIdAttributeItemValue', async () => {
		let attr = await IdAttribute.create(testWalletId, 'test', testStaticData);
		let item = attr.items[0];
		let value = item.values[0];
		expect(value.staticData).to.deep.eq(testStaticData);
		const modifiedStaticData = { modified: 'data' };
		let updatedAttr = await IdAttribute.addEditStaticDataToIdAttributeItemValue(
			attr.id,
			item.id,
			value.id,
			modifiedStaticData
		);
		item = updatedAttr.items[0];
		value = item.values[0];
		expect(value.staticData).to.deep.eq(modifiedStaticData);
	});

	it('findAllByWalletId', async () => {
		let attr1 = await IdAttribute.create(testWalletId, 'test', testStaticData);
		let attr2 = await IdAttribute.create(testWalletId, 'test2', testStaticData);
		let all = await IdAttribute.findAllByWalletId(testWalletId);

		expect(all).to.deep.eq({
			[attr1.id]: attr1,
			[attr2.id]: attr2
		});
	});

	it('delete', async () => {
		let attr = await IdAttribute.create(testWalletId, 'test', testStaticData, testDoc);
		let item = attr.items[0];
		let value = item.values[0];
		let doc = await Document.findById(value.documentId);
		expect(doc.id).to.eq(value.documentId);
		await IdAttribute.delete(attr.id, item.id, value.id);
		doc = await Document.findById(value.documentId);
		// eslint-disable-next-line
		expect(doc).to.be.undefined;
		attr = await IdAttribute.query().findById(attr.id);
		// eslint-disable-next-line
		expect(attr).to.be.undefined;
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
		expect(attrs.length).to.be.gt(0);
	});

	it('genInitial', async () => {
		const initial = {
			country_of_residency: 'Algeria',
			first_name: 'test1',
			last_name: 'test1',
			middle_name: 'test1'
		};
		let attrs = await IdAttribute.genInitial(testWalletId, initial);

		expect(attrs.length).to.be.gt(0);
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
		expect(attrs.length).to.be.gt(0);
	});
});
