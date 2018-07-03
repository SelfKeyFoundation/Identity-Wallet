const BaseModel = require('./base');
const TABLE_NAME = 'countries';

class Country extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['name', 'code'],
			properties: {
				id: { type: 'integer' },
				name: { type: 'string' },
				code: { type: 'string' }
			}
		};
	}

	static findAll() {
		return this.query().select();
	}
}

module.exports = Country;
