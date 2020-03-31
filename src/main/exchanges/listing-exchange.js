import BaseModel from '../common/base-model';
import { isDevMode } from 'common/utils/common';
const TABLE_NAME = 'listing_exchanges';
const env = isDevMode() ? 'development' : 'production';
export class ListingExchange extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'name';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['name'],
			properties: {
				id: { type: 'integer' },
				name: { type: 'string' },
				url: { type: 'string' },
				tradeUrl: { type: 'string' },
				region: { type: 'string' },
				pairs: { type: 'string' },
				comment: { type: 'string' },
				env: { type: 'string', enum: ['production', 'development'] }
			}
		};
	}

	static create(data) {
		return this.query().insertAndFetch({ ...data, env });
	}

	static findAll() {
		return this.query().where({ env });
	}

	static async import(data) {
		const existing = (await this.findAll().select('name')).reduce((lookup, row) => {
			lookup[row.name] = true;
			return lookup;
		}, {});
		const incoming = {};
		const inserts = [];
		const updates = [];

		data.forEach(row => {
			incoming[row.name] = true;
			if (existing[row.name]) {
				updates.push({ ...row, env });
				return;
			}

			inserts.push({ ...row, env });
		});

		const toDelete = Object.keys(existing).filter(name => !incoming[name]);

		await this.insertMany(inserts);
		await this.updateMany(updates);
		await this.deleteMany(toDelete);
	}
}

export default ListingExchange;
