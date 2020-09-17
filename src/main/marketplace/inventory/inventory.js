import BaseModel from '../../common/base-model';
import { isDevMode, isTestMode } from 'common/utils/common';
const TABLE_NAME = 'inventory';
const env = isTestMode() ? 'test' : isDevMode() ? 'development' : 'production';
export class Inventory extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['sku', 'vendorId', 'category'],
			properties: {
				id: { type: 'integer' },
				sku: { type: 'string' },
				vendorId: { type: 'string' },
				entityType: { type: 'string' },
				env: { type: 'string', enum: ['development', 'production', 'test'] },
				name: { type: 'string', default: '' },
				description: { type: 'string', default: '' },
				status: { type: 'string', enum: ['active', 'inactive'], default: 'inactive' },
				parentSku: { type: ['string', null], default: null },
				category: { type: 'string' },
				price: { type: ['string', null], default: null },
				priceCurrency: { type: ['string', null], default: null },
				relyingPartyConfig: { type: 'object', default: {} },
				data: { type: 'object', default: {} }
			}
		};
	}

	static findAll() {
		return this.query().where({ env });
	}

	static findBySku(sku) {
		return this.query().findOne({ sku, env });
	}

	static create(data) {
		return this.query().insertAndFetch({ ...data, env });
	}

	static updateById(id, data) {
		return this.query().patchAndFetchById(id, data);
	}

	static bulkEdit(items, hideErrors) {
		items = items.map(item => ({ ...item, env }));
		return this.updateMany(items, null, hideErrors);
	}

	static bulkAdd(items, hideErrors) {
		items = items.map(item => ({ ...item, env }));
		return this.insertMany(items, null, hideErrors);
	}

	static async bulkUpsert(items, hideErrors = false) {
		const insert = items.filter(item => !item.hasOwnProperty(this.idColumn));
		const update = items.filter(item => item.hasOwnProperty(this.idColumn));

		let all = await this.bulkAdd(insert, hideErrors);
		all = all.concat(await this.bulkEdit(update, hideErrors));

		return this.findAll().whereIn(this.idColumn, all.map(itm => itm[this.idColumn]));
	}
}

export default Inventory;
