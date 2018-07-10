const { expect } = require('chai');
const IdAttribute = require('../../../src/main/models/id-attribute');
const db = require('../../utils/db');
describe('IdAttribute model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	xit('create', () => {});

	xit('addEditDocumentToIdAttributeItemValue', () => {});

	xit('addEditStaticDataToIdAttributeItemValue', () => {});

	xit('findAllByWalletId', () => {});

	xit('delete', () => {});

	xit('addImportedIdAttributes', () => {});

	it('genInitial', async () => {
		const initial = {
			country_of_residency: 'Algeria',
			first_name: 'test1',
			last_name: 'test1',
			middle_name: 'test1'
		};
		let walletId = 1;

		let attrs = await IdAttribute.genInitial(walletId, initial);

		expect(attrs.length).to.be.gt(0);
	});

	xit('initializeImported', () => {});
});
