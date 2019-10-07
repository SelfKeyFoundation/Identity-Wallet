import BaseModel from '../../common/base-model';
import { transaction } from 'objection';
import { isDevMode, isTestMode, setImmediatePromise, arrayChunks } from 'common/utils/common';
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

	static bulkEdit(items, tx = undefined) {
		items = items.map(item => ({ ...item, env }));
		return this.updateMany(items, tx);
	}

	static async bulkAdd(items, tx = undefined) {
		items = items.map(item => ({ ...item, env }));
		return this.insertMany(items, tx);
	}

	static async bulkUpsert(items, chunkSize = 100) {
		let all = [];
		const chunks = arrayChunks(items, chunkSize);

		const tx = await transaction.start(this.knex());
		try {
			for (const chunk of chunks) {
				const insert = chunk.filter(item => !item.hasOwnProperty(this.idColumn));
				const update = chunk.filter(item => item.hasOwnProperty(this.idColumn));

				all = all.concat(await this.bulkAdd(insert, tx));
				all = all.concat(await this.bulkEdit(update, tx));
				await setImmediatePromise();
			}
			await tx.commit();
			const found = await this.findAll();
			const foundItems = found.filter(x =>
				all.find(t => t[this.idColumn] === x[this.idColumn])
			);
			return foundItems;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}
}

export default TaxTreaties;
