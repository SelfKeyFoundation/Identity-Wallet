const { Model } = require('objection');
const BaseModel = require('./base');
const TABLE_NAME = 'exchange_data';

class Exchange extends BaseModel {
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
				createdAt: { type: 'integer' },
				updatedAt: { type: 'integer' }
			}
		};
	}

	static create(data) {
		return this.query().insert(data);
	}

	static findAll() {
		return this.query();
	}

	static async import() {
		const existing = (await this.findAll().select('name')).reduce((lookup, row) => {
			lookup[row.name] = true;
			return lookup;
		}, {});
		const inserts = [];
		const updates = [];

		exchangeData.forEach(row => {
			if (existing[row.name]) {
				updates.push(row);
				return;
			}

			inserts.push(row);
		});

		await this.insertMany(inserts);
		await this.updateMany(updates, ({ name }) => ({ name }));
	}
}

module.exports = Exchange;
