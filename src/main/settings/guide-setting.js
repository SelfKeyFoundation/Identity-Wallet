import BaseModel from '../common/base-model';
import { Logger } from 'common/logger';
const log = new Logger('GuideSettings');

const TABLE_NAME = 'guide_settings';
let crashReportAgreement = false;

export class GuideSetting extends BaseModel {
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
				crashReportAgreement: { type: 'integer' }
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

export default GuideSetting;
