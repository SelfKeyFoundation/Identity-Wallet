import BaseModel from '../../common/base-model';
import { isDevMode, isTestMode } from 'common/utils/common';
const TABLE_NAME = 'tax_treaties';
const env = isTestMode() ? 'test' : isDevMode() ? 'development' : 'production';
export class TaxTreaties extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['countryCode', 'jurisdictionCountryCode'],
			properties: {
				id: { type: 'integer' },
				countryCode: { type: 'string' },
				jurisdictionCountryCode: { type: 'string' },
				jurisdiction: { type: 'string' },
				env: { type: 'string', enum: ['development', 'production', 'test'] },
				typeEOI: { type: ['string', 'null'], default: null },
				dateSigned: { type: ['string', 'null'], default: null },
				dateActive: { type: ['string', 'null'], default: null },
				meetsStandards: { type: ['string', 'null'], default: null },
				containsParas4and5: { type: ['string', 'null'], default: null },
				pdfUrl: { type: ['string', 'null'], default: null }
			}
		};
	}

	static findAll() {
		return this.query().where({ env });
	}

	static findByCountryCode(countryCode) {
		return this.query().findOne({ countryCode, env });
	}

	static create(data) {
		return this.query().insertAndFetch({ ...data, env });
	}

	static updateById(id, data) {
		return this.query().patchAndFetchById(id, data);
	}

	static bulkEdit(items) {
		items = items.map(item => ({ ...item, env }));
		return this.updateMany(items);
	}

	static bulkAdd(items) {
		items = items.map(item => ({ ...item, env }));
		return this.insertMany(items);
	}

	static async bulkUpsert(items) {
		const insert = items.filter(item => !item.hasOwnProperty(this.idColumn));
		const update = items.filter(item => item.hasOwnProperty(this.idColumn));

		let all = await this.bulkAdd(insert);
		all = all.concat(await this.bulkEdit(update));

		let found = await this.findAll();
		return found.filter(x => x[this.idColumn] === all[this.idColumn]);
	}
}

export default TaxTreaties;
