const { expect } = require('chai');
const IdAttribute = require('../../../src/main/models/id-attribute');
const db = require('../../utils/db');
describe('IdAttribute model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	it('create', () => {});

	it('addEditDocumentToIdAttributeItemValue', () => {});

	it('addEditStaticDataToIdAttributeItemValue', () => {});

	it('findAllByWalletId', () => {});

	it('delete', () => {});

	it('addImportedIdAttributes', () => {});

	it('genInitial', () => {});

	it('initializeImported', () => {});
});
