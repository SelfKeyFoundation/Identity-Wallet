import { Model } from 'objection';
import BaseModel from '../common/base-model';
const TABLE_NAME = 'json_schema';

export class JsonSchema extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['url', 'attributeTypeId'],
		properties: {
			id: { type: 'integer' },
			url: { type: 'string' },
			defaultRepositoryId: { type: 'integer' },
			attributeTypeId: { type: 'integer' },
			content: { type: 'object' },
			expires: { type: 'integer' }
		}
	};

	static get relationMappings() {
		const IdAttributeType = require('./id-attribute-type').default;
		const Repository = require('./repository').default;
		return {
			idAttributeType: {
				relation: Model.HasOneRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.attributeTypeId`,
					to: `${IdAttributeType.tableName}.id`
				}
			},
			defaultRepository: {
				relation: Model.HasOneRelation,
				modelClass: Repository,
				join: {
					from: `${this.tableName}.defaultRepositoryId`,
					to: `${Repository.tableName}.id`
				}
			}
		};
	}

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

export default JsonSchema;
