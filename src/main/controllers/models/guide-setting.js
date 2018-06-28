const { knex } = require('../../services/knex');
const log = require('electron-log');
const TABLE_NAME = 'guide_settings';
let crashReportAgreement = false;

const findAllGuideSettings = () => knex(TABLE_NAME).select();

module.exports = () => ({
	hasAgreedToCrashReport: () => {
		return crashReportAgreement;
	},
	findAll: findAllGuideSettings,
	updateById: (id, data) => {
		crashReportAgreement = data.crashReportAgreement;
		return knex(TABLE_NAME)
			.where({ id })
			.update(data);
	},
	loadCrashReportAgreement: async () => {
		const guideSettings = await findAllGuideSettings();
		crashReportAgreement = guideSettings[0].crashReportAgreement === 1;
	}
});
