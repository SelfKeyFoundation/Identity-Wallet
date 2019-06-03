import BaseModel from '../../common/base-model';
import { isDevMode, isTestMode } from 'common/utils/common';
const TABLE_NAME = 'marketplace_country';
const env = isTestMode() ? 'test' : isDevMode() ? 'development' : 'production';
export class MarketplaceCountry extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['code'],
			properties: {
				id: { type: 'integer' },
				code: { type: 'string' },
				name: { type: 'string', default: '' },
				env: { type: 'string', enum: ['development', 'production', 'test'] },
				currencyCode: { type: ['string', 'null'], default: null },
				population: { type: ['integer', 'null'], default: null },
				fipsCode: { type: ['string', 'null'], default: null },
				isoNumeric: { type: ['string', 'null'], default: null },
				north: { type: ['string', 'null'], default: null },
				south: { type: ['string', 'null'], default: null },
				east: { type: ['string', 'null'], default: null },
				west: { type: ['string', 'null'], default: null },
				capital: { type: ['string', 'null'], default: null },
				continentName: { type: ['string', 'null'], default: null },
				continent: { type: ['string', 'null'], default: null },
				areaInSqKm: { type: ['string', 'null'], default: null },
				languages: { type: 'array', default: [] },
				isoAlpha3: { type: ['string', 'null'], default: null },
				geonameId: { type: ['string', 'null'], default: null }
			}
		};
	}

	static findAll() {
		return this.query().where({ env });
	}

	static findByCountryCode(code) {
		return this.query().findOne({ code, env });
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

		return this.findAll().whereIn(this.idColumn, all.map(itm => itm[this.idColumn]));
	}
}

export default MarketplaceCountry;
