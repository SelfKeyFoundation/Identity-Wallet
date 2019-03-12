import BaseModel from '../common/base-model';
import { isDevMode } from 'common/utils/common';
const TABLE_NAME = 'exchange_data';
const env = isDevMode() ? 'development' : 'production';
export class Exchange extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'name';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['name', 'data'],
			properties: {
				name: { type: 'string' },
				data: { type: 'object' },
				env: { type: 'string', enum: ['production', 'development'] }
			}
		};
	}

	static create(data) {
		return this.query().insert({ ...data, env });
	}

	static findAll() {
		return this.query().where({ env });
	}

	static async import(data) {
		const existing = (await this.findAll().select('name')).reduce((lookup, row) => {
			lookup[row.name] = true;
			return lookup;
		}, {});
		const inserts = [];
		const updates = [];

		data.forEach(row => {
			if (existing[row.name]) {
				updates.push({ ...row, env });
				return;
			}

			inserts.push({ ...row, env });
		});

		await this.insertMany(inserts);
		await this.updateMany(updates);
	}
}

export default Exchange;
