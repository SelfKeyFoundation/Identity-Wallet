import BaseModel from '../../common/base-model';
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
				entityTypes: { type: 'array', items: { type: 'string' }, default: ['individual'] },
				env: { type: 'string', enum: ['development', 'production', 'test'] },
				name: { type: 'string', default: '' },
				description: { type: 'string', default: '' },
				status: { type: 'string', enum: ['active', 'inactive'], default: 'inactive' },
				categories: { type: 'array', default: [] },
				inventorySource: {
					type: 'string',
					enum: ['selfkey', 'external'],
					default: 'selfkey'
				},
				relyingPartyConfig: { type: 'object', default: {} },
				privacyPolicy: { type: 'string', default: '' },
				termsOfService: { type: 'string', default: '' },
				contactEmail: { type: 'string', default: '' },
				did: { type: 'string', default: '' },
				paymentAddress: { type: 'string', default: '' }
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

export default Vendor;
