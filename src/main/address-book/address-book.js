import BaseModel from '../common/base-model';

const TABLE_NAME = 'addressBook';

export class AddressBook extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['label', 'address'],
			properties: {
				id: { type: 'integer' },
				label: { type: 'string' },
				address: { type: 'string' }
			}
		};
	}

	static findAll() {
		return this.query();
	}
}

export default AddressBook;
