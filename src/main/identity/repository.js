import { Model } from 'objection';
import BaseModel from '../common/base-model';
const TABLE_NAME = 'repository';

export class Repository extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['url'],
		properties: {
			id: { type: 'integer' },
			url: { type: 'string' },
			name: { type: 'string' },
			eager: { type: 'boolean', default: false },
			content: { type: 'object' },
			expires: { type: 'integer' }
		}
	};

	static get relationMappings() {
		const IdAttributeType = require('./id-attribute-type').default;
		const UiSchema = require('./ui-schema').default;

		return {
			attributeTypes: {
				relation: Model.ManyToManyRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.id`,
					through: {
						from: 'repository_attribute_types.repositoryId',
						to: 'repository_attribute_types.attributeTypeId'
					},
					to: `${IdAttributeType.tableName}.id`
				}
			},
			uiSchemas: {
				relation: Model.HasManyRelation,
				modelClass: UiSchema,
				join: {
					from: `${this.tableName}.id`,
					to: `${UiSchema.tableName}.repositoryId`
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

export default Repository;
