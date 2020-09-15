import BaseModel from '../../common/base-model';
import { isDevMode, isTestMode } from 'common/utils/common';
const env = isTestMode() ? 'test' : isDevMode() ? 'development' : 'production';
const TABLE_NAME = 'contracts';

export class Contract extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['address', 'name'],
			properties: {
				id: { type: 'integer' },
				name: 'string',
				type: 'deposit',
				address: { type: 'string' },
				deprecated: { type: 'boolean', default: false },
				active: { type: 'boolean', default: false },
				abi: { type: 'array', default: [] },
				config: { type: 'object', default: {} },
				env: { type: 'string', enum: ['development', 'production', 'test'] }
			}
		};
	}

	static findAll() {
		return this.query().where({ env });
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

export default Contract;
