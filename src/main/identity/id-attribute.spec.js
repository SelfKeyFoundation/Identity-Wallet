import IdAttribute from './id-attribute';
import IdAttributeType from './id-attribute-type';
import Document from './document';
import TestDb from '../db/test-db';

describe('IdAttribute model', () => {
	const testWalletId = 1;
	const testAttribute = { walletId: testWalletId, typeId: 1, data: { value: 'test' } };
	const testAttributeComplex = {
		walletId: testWalletId,
		typeId: 2,
		data: { testDate1: 'testdata' }
	};
	const testDoc = {
		name: 'test',
		mimeType: 'test-mime',
		size: 100,
		buffer: Buffer.alloc(100)
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
		attr = await IdAttribute.create({ ...testAttribute, documents: [testDoc] });
		expect(attr.id).toBeGreaterThan(0);
		expect(attr.walletId).toBe(testWalletId);
		expect(attr.createdAt).toBeGreaterThan(0);
		expect(attr.updatedAt).toBeGreaterThan(0);
		expect(attr.data).toEqual(testAttribute.data);
		expect(attr.documens).not.toBeNull();
		expect(attr.documents[0]).not.toBeNull();
	});

	it('findAllByWalletId', async () => {
		await IdAttribute.create(testAttribute);
		await IdAttribute.create({ ...testAttribute, walletId: 2 });
		await IdAttribute.create(testAttribute);

		let res = await IdAttribute.findAllByWalletId(testWalletId);
		expect(res.length).toBe(2);
	});

	it('delete', async () => {
		let attr = await IdAttribute.create({ ...testAttribute, documents: [testDoc] });
		await attr.$loadRelated('documents');
		expect(attr.documents.length).toBe(1);
		await IdAttribute.delete(attr.id);
		let doc = await Document.findById(attr.documents[0].id);
		expect(doc).toBeUndefined();
		attr = await IdAttribute.query().findById(attr.id);
		expect(attr).toBeUndefined();
	});

	it('findByTypeUrls', async () => {
		await IdAttributeType.create({
			url: 'test',
			content: {},
			expires: 0,
			defaultRepositoryId: 1
		});
		await IdAttributeType.create({
			url: 'test2',
			content: {},
			expires: 0,
			defaultRepositoryId: 1
		});
		await IdAttributeType.create({
			url: 'test3',
			content: {},
			expires: 0,
			defaultRepositoryId: 1
		});
		await IdAttribute.create({ walletId: 1, typeId: 1, data: { value: 'test' } });
		await IdAttribute.create({ walletId: 1, typeId: 2, data: { value: 'test1' } });
		await IdAttribute.create({ walletId: 2, typeId: 2, data: { value: 'test1-1' } });
		await IdAttribute.create({
			walletId: 1,
			typeId: 2,
			data: { value: 'test1.1' },
			documents: [testDoc]
		});
		await IdAttribute.create({ walletId: 1, typeId: 3, data: { value: 'test2' } });

		let attrs = await IdAttribute.findByTypeUrls(1, ['test', 'test2']);

		expect(attrs.map(attr => attr.data.value)).toEqual(['test', 'test1', 'test1.1']);

		attrs = await IdAttribute.findByTypeUrls(1, ['test', 'test2']).eager(
			'[documents, attributeType]'
		);
		expect(attrs[2].documents.length).toBe(1);
		expect(attrs[1].attributeType.id).toBe(2);
	});
});
