import { init as initSentry } from '@sentry/electron';
import GuideSetting from 'main/settings/guide-setting';
import { Logger } from 'common/logger';

const log = new Logger('crash-report-service');

export class CrashReportService {
	static async startCrashReport() {
		log.info('Starting Crash Report');
		initSentry({
			dsn:
				'https://c387782605f5441e83e5d8586dd56fb3@o677589.ingest.sentry.io/4503971170680832',
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
