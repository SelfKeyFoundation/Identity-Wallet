import BaseModel from '../common/base-model';

const TABLE_NAME = 'countries';

export class Country extends BaseModel {
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
		return this.query();
	}
}

export default Country;
