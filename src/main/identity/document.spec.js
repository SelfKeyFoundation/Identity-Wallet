import Document from './document';
import TestDb from '../db/test-db';
import { IdAttribute } from './id-attribute';

describe('Document model', () => {
	const testDoc = {
		name: 'test',
		mimeType: 'test-mime',
		size: 100,
		buffer: Buffer.alloc(100),
		attributeId: 1
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
		const doc = await Document.query().insert(testDoc);
		expect(doc.id).toBeGreaterThan(0);
		const found = await Document.findById(doc.id);
		expect(doc).toEqual(found);
	});

	it('create', async () => {
		const doc = await Document.create(testDoc);
		const doc2 = await Document.create(testDoc);
		expect(doc.id).toBeGreaterThan(0);
		expect(doc2.id).toBeGreaterThan(0);
		expect(doc.id).not.toBe(doc2.id);
		expect(doc.buffer.equals(doc2.buffer));
	});

	it('delete', async () => {
		const doc = await Document.query().insertAndFetch(testDoc);
		let found = await Document.query().findById(doc.id);
		expect(doc).toEqual(found);
		await Document.delete(doc.id);
		found = await Document.query().findById(doc.id);
		expect(found).toBeUndefined();
	});

	it('getDataUrl', async () => {
		const doc = await Document.create(testDoc);
		const dataUrl = doc.getDataUrl();
		const base64 = testDoc.buffer.toString('base64');
		expect(dataUrl).toBe(`data:${testDoc.mimeType};base64,${base64}`);
	});

	it('findAllByIdentityId', async () => {
		await IdAttribute.create({
			identityId: 1,
			typeId: 1,
			documents: [
				{
					name: 'test1',
					mimeType: 'test-mime2',
					size: 100,
					buffer: Buffer.alloc(100)
				}
			]
		});
		await IdAttribute.create({
			identityId: 2,
			typeId: 1,
			documents: [
				{
					name: 'test2',
					mimeType: 'test-mime1',
					size: 100,
					buffer: Buffer.alloc(100)
				}
			]
		});
		await IdAttribute.create({
			identityId: 1,
			typeId: 1,
			documents: [
				{
					name: 'test3',
					mimeType: 'test-mime1',
					size: 100,
					buffer: Buffer.alloc(100)
				}
			]
		});
		let docs = await Document.findAllByIdentityId(1);
		expect(docs.length).toBe(2);
		expect(docs[0].name).toBe('test1');
		expect(docs[1].name).toBe('test3');
		docs = await Document.findAllByIdentityId(2);
		expect(docs.length).toBe(1);
		expect(docs[0].name).toBe('test2');
	});

	it('findAllByAttributeId', async () => {
		await Document.create({
			attributeId: 1,
			mimeType: 'test',
			name: 'test1',
			size: 100,
			buffer: Buffer.alloc(100)
		});
		await Document.create({
			attributeId: 2,
			mimeType: 'test2',
			name: 'test2',
			size: 100,
			buffer: Buffer.alloc(100)
		});
		await Document.create({
			attributeId: 1,
			mimeType: 'test3',
			name: 'test3',
			size: 100,
			buffer: Buffer.alloc(100)
		});
		let docs = await Document.findAllByAttributeId(1);
		expect(docs.length).toBe(2);
		expect(docs[0].name).toBe('test1');
		expect(docs[1].name).toBe('test3');
		docs = await Document.findAllByAttributeId(2);
		expect(docs.length).toBe(1);
		expect(docs[0].name).toBe('test2');
	});
});
