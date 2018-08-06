import sinon from 'sinon';
import * as SentryElectron from '@sentry/electron';
import CrashReportService from './crash-report-service';
import GuideSetting from 'main/settings/guide-setting';

describe('CrashReportService', () => {
	afterEach(() => {
		sinon.restore();
	});
	it('startCrashReport', async () => {
		let stub = sinon.stub(SentryElectron, 'init');
		let settingStub = sinon.stub(GuideSetting, 'loadCrashReportAgreement');
		settingStub.resolves('ok');
		await CrashReportService.startCrashReport();
		expect(stub.calledOnce).toBeTruthy();
		expect(settingStub.calledOnce).toBeTruthy();
	});
	it('shouldSend', () => {
		let stub = sinon.stub(GuideSetting, 'hasAgreedToCrashReport');
		let ok = 'ok';
		stub.returns(ok);
		expect(CrashReportService.shouldSend()).toBe(ok);
		expect(stub.calledOnce).toBeTruthy();
	});
});
