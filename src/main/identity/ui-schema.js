import { Model } from 'objection';
import BaseModel from '../common/base-model';
const TABLE_NAME = 'ui_schema';

export class UiSchema extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['url', 'repositoryId', 'attributeTypeId'],
		properties: {
			id: { type: 'integer' },
			url: { type: 'string' },
			repositoryId: { type: 'integer' },
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
			repository: {
				relation: Model.HasOneRelation,
				modelClass: Repository,
				join: {
					from: `${this.tableName}.repositoryId`,
					to: `${Repository.tableName}.id`
				}
			}
		};
	}

	static findByUrl(url, repositoryId, tx) {
		return this.query(tx).findOne({ url, repositoryId });
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

export default UiSchema;
