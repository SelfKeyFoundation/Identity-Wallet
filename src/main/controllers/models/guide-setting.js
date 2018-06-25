const { knex } = require('../../services/knex');
const log = require('electron-log');
const TABLE_NAME = 'guide_settings';
let crashReportAgreement = false;

const mod = module.exports = () => ({
    findAll: () => knex(TABLE_NAME).select(),
    hasAgreedToCrashReport: () => {
		return crashReportAgreement;
    },
    loadCrashReportAgreement: async () => {
        try{
            const guideSettings = await mod.findAll();
            crashReportAgreement = guideSettings.length > 0 ? guideSettings[0].crashReportAgreement === 1 : false;
        } catch(e){
            log.error(e);
        }
	},
	updateById: (id, data) => {
        crashReportAgreement = data.crashReportAgreement;
		return knex(TABLE_NAME)
			.where({ id })
            .update(data)
    }

});
