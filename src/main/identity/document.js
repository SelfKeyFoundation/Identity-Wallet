import { Model } from 'objection';
import BaseModel from '../common/base-model';
import { formatDataUrl } from 'common/utils/document';
const TABLE_NAME = 'documents';

export class Document extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'integer' },
			name: { type: 'string' },
			mimeType: { type: 'string' },
			size: { type: 'integer' },
			buffer: { type: 'binary' },
			attributeId: { type: 'integer' }
		},
		required: ['attributeId', 'mimeType', 'size', 'buffer']
	};

	static get relationMappings() {
		const IdAttribute = require('./id-attribute').default;
		return {
			attribute: {
				relation: Model.BelongsToOneRelation,
				modelClass: IdAttribute,
				join: {
					from: `${this.tableName}.attributeId`,
					to: `${IdAttribute.tableName}.id`
				}
			}
		};
	}

	static findAllByIdentityId(identityId) {
		return this.query()
			.select(`${TABLE_NAME}.*`)
			.join('id_attributes', `${TABLE_NAME}.attributeId`, 'id_attributes.id')
			.where({ 'id_attributes.identityId': identityId });
	}

	static findAllByAttributeId(attributeId) {
		return this.query().where({ attributeId });
	}

	getDataUrl() {
		return formatDataUrl(this.mimeType, this.buffer);
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

export default Document;
