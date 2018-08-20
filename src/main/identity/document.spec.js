import Document from './document';
import TestDb from '../db/test-db';

describe('Country model', () => {
	let db;
	beforeAll(async () => {
		db = new TestDb();
		await db.init();
	});
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
		// eslint-disable-next-line no-unused-expressions
		expect(found).toBeUndefined();
	});
});
