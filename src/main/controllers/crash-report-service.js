const { init } = require('@sentry/electron');
const guideSettings = require('./models/guide-setting')();
const log = require('electron-log');
// DSN will be inject during build time
const sentry = require('../assets/data/sentry');
let hasStarted = false;

module.exports = {
	startCrashReport: async () => {
		if (process.env.NODE_ENV !== 'development' && process.env.MODE !== 'test') {
			const result = await guideSettings.findAll();
			if (result[0].crashReportAgreement && !hasStarted) {
				hasStarted = true;
				init({
					dsn: sentry.dsn
				});
				log.info('CRASH REPORT STARTED');
			} else {
				log.info(
					'CRASH REPORT NOT STARTED ',
					'crashReportAgreement: ',
					result[0].crashReportAgreement,
					'hasStarted: ',
					hasStarted
				);
			}
		}
		return;
	}
};
