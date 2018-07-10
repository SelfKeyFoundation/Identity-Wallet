const { expect } = require('chai');
const GuideSetting = require('../../../src/main/models/guide-setting');
const db = require('../../utils/db');

describe('GuideSettings model', () => {
	beforeEach(async () => {
		await db.reset();
		GuideSetting.reset();
	});

	it('crashReport', async () => {
		expect(GuideSetting.hasAgreedToCrashReport()).to.eq(false);
		await GuideSetting.loadCrashReportAgreement();
		expect(GuideSetting.hasAgreedToCrashReport()).to.eq(false);

		let all = await GuideSetting.query();
		expect(all.length).to.be.gt(0);
		let setting = all[0];
		await setting.$query().patch({ crashReportAgreement: 1 });
		expect(GuideSetting.hasAgreedToCrashReport()).to.eq(false);
		await GuideSetting.loadCrashReportAgreement();
		expect(GuideSetting.hasAgreedToCrashReport()).to.eq(true);

		await setting.$query().patch({ crashReportAgreement: 0 });
		await GuideSetting.loadCrashReportAgreement();
		expect(GuideSetting.hasAgreedToCrashReport()).to.eq(false);
		await GuideSetting.updateById(setting.id, { crashReportAgreement: true });

		expect(GuideSetting.hasAgreedToCrashReport()).to.eq(true);
		await GuideSetting.loadCrashReportAgreement();
		expect(GuideSetting.hasAgreedToCrashReport()).to.eq(true);
	});

	it('updateById', async () => {
		let all = await GuideSetting.query();
		expect(all.length).to.be.gt(0);
		let setting = all[0];

		expect(setting.icoAdsShown).to.eq(0);
		let updatedSetting = await GuideSetting.updateById(setting.id, { icoAdsShown: 1 });
		expect(updatedSetting.icoAdsShown).to.eq(1);
	});
});
