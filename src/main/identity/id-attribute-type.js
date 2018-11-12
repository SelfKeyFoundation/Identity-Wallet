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
			required: ['url', 'schemaId'],
			properties: {
				id: { type: 'integer' },
				url: { type: 'string' },
				schemaId: { type: 'integer' },
				defaultRepositoryId: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const JsonSchema = require('./json-schema').default;
		const Repository = require('./repository').default;
		const UiSchema = require('./ui-schema').default;

		return {
			schema: {
				relation: Model.HasOneRelation,
				modelClass: JsonSchema,
				join: {
					from: `${this.tableName}.schemaId`,
					to: `${JsonSchema.tableName}.id`
				}
			},
			defaultRepository: {
				relation: Model.HasOneRelation,
				modelClass: Repository,
				join: {
					from: `${this.tableName}.defaultRepositoryId`,
					to: `${Repository.tableName}.id`
				}
			},
			uiSchemas: {
				relation: Model.HasManyRelation,
				modelClass: UiSchema,
				join: {
					from: `${this.tableName}.id`,
					to: `${UiSchema.tableName}.attributeTypeId`
				}
			},
			repositories: {
				relation: Model.ManyToManyRelation,
				modelClass: Repository,
				join: {
					from: `${this.tableName}.id`,
					through: {
						from: 'repository_attribute_types.attributeTypeId',
						to: 'repository_attribute_types.repositoryId'
					},
					to: `${Repository.tableName}.id`
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
