const { knex, sqlUtil } = require('../services/knex');
const log = require('electron-log');
const TABLE_NAME = 'guide_settings';
let crashReportAgreement = false;

const mod = (module.exports = {
	findAll: tx => sqlUtil.select(TABLE_NAME, '*', null, tx),
	hasAgreedToCrashReport: () => {
		return crashReportAgreement;
	},
	loadCrashReportAgreement: async () => {
		try {
			const guideSettings = await mod.findAll();
			crashReportAgreement =
				guideSettings.length > 0 ? guideSettings[0].crashReportAgreement === 1 : false;
		} catch (e) {
			log.error(e);
		}
	},
	updateById: (id, data, tx) => {
		crashReportAgreement = data.crashReportAgreement;
		return sqlUtil.updateById(TABLE_NAME, id, data, tx);
	}
});
