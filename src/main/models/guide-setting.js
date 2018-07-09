const { Model } = require('objection');
const BaseModel = require('./base');
const log = require('electron-log');

const TABLE_NAME = 'guide_settings';
let crashReportAgreement = false;

class GuideSettings extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['name', 'code'],
			properties: {
				id: { type: 'integer' },
				guideShown: { type: 'integer' },
				icoAdsShown: { type: 'integer' },
				termsAccepted: { type: 'integer' },
				crashReportAgreement: { type: 'integer' },
				createdAt: { type: 'integer' },
				updatedAt: { type: 'integer' }
			}
		};
	}

	static findAll() {
		return this.query();
	}

	// TODO: refactor, remove crashReportAgreement global VAR
	static hasAgreedToCrashReport() {
		return crashReportAgreement;
	}

	static async loadCrashReportAgreement() {
		try {
			const guideSettings = await this.findAll();
			crashReportAgreement =
				guideSettings.length > 0 ? guideSettings[0].crashReportAgreement === 1 : false;
		} catch (e) {
			log.error(e);
		}
	}

	static updateById(id, data) {
		if ('crashReportAgreement' in data) {
			data.crashReportAgreement = data.crashReportAgreement ? 1 : 0;
			crashReportAgreement = !!data.crashReportAgreement;
		}
		return this.query().patchAndFetchById(id, data);
	}

	static reset() {
		crashReportAgreement = false;
	}
}

module.exports = GuideSettings;
