const { expect } = require('chai');
const IdAttribute = require('../../../src/main/models/id-attribute-type');
const db = require('../../utils/db');

describe('GuideSettings model', () => {
	beforeEach(async () => {
		await db.reset();
	});

	xit('create', () => {});

	xit('hasAgreedToCrashReport', () => {});

	xit('loadCrashReportAgreement', () => {});

	xit('updateById', () => {});
});
