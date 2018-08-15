import { Model } from 'objection';
import BaseModel from '../common/base-model';

const TABLE_NAME = 'id_attribute_schemas';

export class IdAttributeSchema extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'type';
	static jsonSchema = {
		type: 'object',
		required: ['type'],
		properties: {
			type: { type: 'string' },
			expires: { type: 'integer' },
			jsonSchema: { type: 'object' },
			uiSchema: { type: 'object' },
			jsonSchemaUrl: { type: 'string' },
			uiSchemaUrl: { type: 'string' }
		}
	};
	static get relationMappings() {
		const IdAttributeType = require('./id-attribute-type').default;
		return {
			attributeType: {
				relation: Model.BelongsToOneRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.type`,
					to: `${IdAttributeType.tableName}.key`
				}
			}
		};
	}

	hasExpired() {
		return Date.now() > this.expires;
	}
}

export default IdAttributeSchema;
