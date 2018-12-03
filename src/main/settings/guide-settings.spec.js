import GuideSetting from './guide-setting';
import TestDb from '../db/test-db';

xdescribe('GuideSettings model', () => {
	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
		GuideSetting.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});

	it('crashReport', async () => {
		expect(GuideSetting.hasAgreedToCrashReport()).toBe(false);
		await GuideSetting.loadCrashReportAgreement();
		expect(GuideSetting.hasAgreedToCrashReport()).toBe(false);

		let all = await GuideSetting.query();
		expect(all.length).toBeGreaterThan(0);
		let setting = all[0];
		await setting.$query().patch({ crashReportAgreement: 1 });
		expect(GuideSetting.hasAgreedToCrashReport()).toBe(false);
		await GuideSetting.loadCrashReportAgreement();
		expect(GuideSetting.hasAgreedToCrashReport()).toBe(true);

		await setting.$query().patch({ crashReportAgreement: 0 });
		await GuideSetting.loadCrashReportAgreement();
		expect(GuideSetting.hasAgreedToCrashReport()).toBe(false);
		await GuideSetting.updateById(setting.id, { crashReportAgreement: true });

		expect(GuideSetting.hasAgreedToCrashReport()).toBe(true);
		await GuideSetting.loadCrashReportAgreement();
		expect(GuideSetting.hasAgreedToCrashReport()).toBe(true);
	});

	it('updateById', async () => {
		let all = await GuideSetting.query();
		expect(all.length).toBeGreaterThan(0);
		let setting = all[0];

		expect(setting.icoAdsShown).toBe(0);
		let updatedSetting = await GuideSetting.updateById(setting.id, { icoAdsShown: 1 });
		expect(updatedSetting.icoAdsShown).toBe(1);
	});
});
