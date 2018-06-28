const { init } = require('@sentry/electron');
const guideSettings = require('./models/guide-setting')();
const log = require('electron-log');
// DSN will be inject during build time
const sentry = require('../assets/data/sentry');

module.exports = {
	startCrashReport: () => {
		//if (process.env.NODE_ENV !== 'development' && process.env.MODE !== 'test') {
		log.info('Starting Crash Report');
		init({
			dsn: sentry.dsn,
			shouldSend: data => {
				log.info(
					'guideSettings.hasAgreedToCrashReport()',
					guideSettings.hasAgreedToCrashReport()
				);
				return guideSettings.hasAgreedToCrashReport();
			}
		});
		guideSettings.loadCrashReportAgreement();
		//}
	}
};
