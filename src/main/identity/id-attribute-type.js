import { Model } from 'objection';
import BaseModel from '../common/base-model';

const TABLE_NAME = 'id_attribute_types';

export class IdAttributeType extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['url', 'schema'],
			properties: {
				id: { type: 'integer' },
				url: { type: 'string' },
				schema: { type: 'integer' },
				defaultRepository: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const JsonSchema = require('./json-schema').default;
		return {
			fullSchema: {
				relation: Model.HasOneRelation,
				modelClass: JsonSchema,
				join: {
					from: `${this.tableName}.schema`,
					to: `${JsonSchema.tableName}.id`
				}
			}
		};
	}

	static create(data) {
		return this.query().insertAndFetch(data);
	}

	static findAll(tx) {
		return this.query(tx);
	}
}

export default IdAttributeType;
