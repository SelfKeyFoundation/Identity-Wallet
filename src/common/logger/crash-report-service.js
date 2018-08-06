import { init as initSentry } from '@sentry/electron';
import GuideSetting from 'main/settings/guide-setting';
import { Logger } from 'common/logger';

// DSN will be inject during build time
import sentry from 'main/assets/data/sentry';

const log = new Logger('crash-report-service');

export class CrashReportService {
	static async startCrashReport() {
		log.info('Starting Crash Report');
		initSentry({
			dsn: sentry.dsn,
			shouldSend: this.shouldSend
		});
		await GuideSetting.loadCrashReportAgreement();
	}
	static shouldSend(data) {
		let agree = GuideSetting.hasAgreedToCrashReport();
		log.info('guideSettings.hasAgreedToCrashReport()', agree);
		return agree;
	}
}

export default CrashReportService;
