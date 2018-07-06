const { expect } = require('chai');
const Document = require('../../../src/main/models/document');
const db = require('../../utils/db');
describe('Country model', () => {
	const testDoc = {
		name: 'test',
		mimeType: 'test-mime',
		size: 100,
		buffer: Buffer.alloc(100)
	};
	beforeEach(async () => {
		await db.reset();
	});
	it('findById', async () => {
		const doc = await Document.query().insert(testDoc);
		expect(doc.id).to.be.gt(0);
		const found = await Document.findById(doc.id);
		expect(doc).to.deep.eq(found);
	});

	it('create', async () => {
		const doc = await Document.create(testDoc);
		const doc2 = await Document.create(testDoc);
		expect(doc.id).to.be.gt(0);
		expect(doc2.id).to.be.gt(0);
		expect(doc.id).to.not.eq(doc2.id);
		expect(doc.buffer.equals(doc2.buffer)).to.eq(true);
	});

	it('delete', async () => {
		const doc = await Document.query().insertAndFetch(testDoc);
		let found = await Document.query().findById(doc.id);
		expect(doc).to.deep.eq(found);
		await Document.delete(doc.id);
		found = await Document.query().findById(doc.id);
		expect(found).to.be.undefined;
	});
});
