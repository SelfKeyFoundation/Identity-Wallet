import BaseModel from '../common/base-model';
import { isDevMode, isTestMode } from 'common/utils/common';
const TABLE_NAME = 'vendors';
const env = isTestMode() ? 'test' : isDevMode() ? 'development' : 'production';
export class Vendor extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['vendorId'],
			properties: {
				id: { type: 'integer' },
				vendorId: { type: 'string' },
				env: { type: 'string', enum: ['development', 'production', 'test'] },
				name: { type: 'string' },
				description: { type: 'string' },
				status: { type: 'string', enum: ['active', 'inactive'] },
				categories: { type: 'array' },
				inventorySource: { type: 'string', enum: ['selfkey', 'external'] },
				relyingPartyConfig: { type: 'object', default: {} },
				privacyPolicy: { type: 'string' },
				contactEmail: { type: 'string' },
				did: { type: 'string' },
				paymentAddress: { type: 'string' }
			}
		};
	}

	static findAll() {
		return this.query().where({ env });
	}

	static findByVendorId(vendorId) {
		return this.query().findOne({ vendorId, env });
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

export default Vendor;
