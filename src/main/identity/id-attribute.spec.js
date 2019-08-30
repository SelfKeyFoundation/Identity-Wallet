import _ from 'lodash';
import IdAttribute from './id-attribute';
import IdAttributeType from './id-attribute-type';
import Document from './document';
import TestDb from '../db/test-db';

describe('IdAttribute model', () => {
	const testIdentityId = 1;
	const testAttribute = { identityId: testIdentityId, typeId: 1, data: { value: 'test' } };
	const testAttributeComplex = {
		identityId: testIdentityId,
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

	describe('create', () => {
		it('sanity', async () => {
			let all = await IdAttribute.query().where({ identityId: testIdentityId });
			expect(all.length).toBe(0);
			let attr = await IdAttribute.create(testAttribute);
			expect(attr.id).toBeGreaterThan(0);
			expect(attr.identityId).toBe(testIdentityId);
			expect(attr.createdAt).toBeGreaterThan(0);
			expect(attr.updatedAt).toBeGreaterThan(0);
			expect(attr.value).toEqual(testAttribute.value);
			attr = await IdAttribute.create(testAttributeComplex);
			expect(attr.value).toEqual(testAttribute.value);
			attr = await IdAttribute.create({ ...testAttribute, documents: [testDoc] });
			expect(attr.id).toBeGreaterThan(0);
			expect(attr.identityId).toBe(testIdentityId);
			expect(attr.createdAt).toBeGreaterThan(0);
			expect(attr.updatedAt).toBeGreaterThan(0);
			expect(attr.data).toEqual(testAttribute.data);
			expect(attr.documens).not.toBeNull();
			expect(attr.documents[0]).not.toBeNull();
		});

		it('should create attributes with document references', async () => {
			let attr = {
				createdAt: 1543342261241,
				data: { value: { image: '$document-#ref{document0.id}' } },
				documents: [
					{
						'#id': 'document0',
						buffer: Uint8Array.from([14, 51, 61]),
						mimeType: 'image/png',
						name: 'unnamed.png',
						size: 3
					}
				],
				name: 'passport',
				typeId: 14,
				updatedAt: 1543342261241,
				identityId: 1
			};
			let create = await IdAttribute.create(attr);
			expect(create.documents.length).toBe(1);
			expect(create.data).toEqual({
				value: { image: `$document-${create.documents[0].id}` }
			});
		});
	});

	it('findAllByIdentityId', async () => {
		await IdAttribute.create(testAttribute);
		await IdAttribute.create({ ...testAttribute, identityId: 2 });
		await IdAttribute.create(testAttribute);

		let res = await IdAttribute.findAllByIdentityId(testIdentityId);
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
		await IdAttribute.create({ identityId: 1, typeId: 1, data: { value: 'test' } });
		await IdAttribute.create({ identityId: 1, typeId: 2, data: { value: 'test1' } });
		await IdAttribute.create({ identityId: 2, typeId: 2, data: { value: 'test1-1' } });
		await IdAttribute.create({
			identityId: 1,
			typeId: 2,
			data: { value: 'test1.1' },
			documents: [testDoc]
		});
		await IdAttribute.create({ identityId: 1, typeId: 3, data: { value: 'test2' } });

		let attrs = await IdAttribute.findByTypeUrls(1, ['test', 'test2']);

		expect(attrs.map(attr => attr.data.value)).toEqual(['test', 'test1', 'test1.1']);

		attrs = await IdAttribute.findByTypeUrls(1, ['test', 'test2']).eager(
			'[documents, attributeType]'
		);
		expect(attrs[2].documents.length).toBe(1);
		expect(attrs[1].attributeType.id).toBe(2);
	});

	describe('update', () => {
		it('should update attributes with document references', async () => {
			let attr = {
				createdAt: 1543342261241,
				data: { value: { image: '$document-#ref{document0.id}' } },
				documents: [
					{
						'#id': 'document0',
						buffer: Uint8Array.from([14, 51, 61]),
						mimeType: 'image/png',
						name: 'unnamed.png',
						size: 3
					}
				],
				id: 17,
				name: 'passport',
				typeId: 14,
				updatedAt: 1543342261241,
				identityId: 1
			};
			await IdAttribute.create(_.omit(attr, ['data', 'document']));
			let update = await IdAttribute.update(attr);
			expect(update.documents.length).toBe(1);
			expect(update.data).toEqual({
				value: { image: `$document-${update.documents[0].id}` }
			});
			expect(update.documents[0].buffer).toEqual(Buffer.from([14, 51, 61]));
		});
	});
});
