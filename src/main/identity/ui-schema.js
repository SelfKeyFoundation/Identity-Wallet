import BaseModel from '../common/base-model';
const TABLE_NAME = 'ui_schema';

export class UiSchema extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['url', 'repository', 'attributeType'],
		properties: {
			id: { type: 'integer' },
			url: { type: 'string' },
			repository: { type: 'integer' },
			attributeType: { type: 'integer' },
			content: { type: 'object' },
			expires: { type: 'integer' }
		}
	};

	static async findById(id) {
		return this.query().findById(id);
	}

	static create(itm, tx) {
		return this.query(tx).insertAndFetch(itm);
	}

	static delete(id, tx) {
		return this.query(tx).deleteById(id);
	}
}

export default UiSchema;
