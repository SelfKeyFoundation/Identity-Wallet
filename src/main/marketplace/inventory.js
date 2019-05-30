import BaseModel from '../common/base-model';
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
			required: ['sku', 'vendorId'],
			properties: {
				id: { type: 'integer' },
				sku: { type: 'string' },
				vendorId: { type: 'string' },
				env: { type: 'string', enum: ['development', 'production', 'test'] },
				name: { type: 'string' },
				description: { type: 'string' },
				status: { type: 'string', enum: ['active', 'inactive'] },
				parentSku: { type: 'string' },
				category: { type: 'string' },
				price: { type: 'string' },
				priceCurrency: { type: 'string' },
				data: { type: 'object', default: {} }
			}
		};
	}

	static findAll() {
		return this.query({ env });
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

	static bulkEdit(items) {
		return this.updateMany(items);
	}

	static bulkAdd(items) {
		return this.insertMany(items);
	}
}

export default Inventory;
