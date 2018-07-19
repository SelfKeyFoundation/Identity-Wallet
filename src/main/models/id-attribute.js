import BaseModel from './base';
import { Model } from 'objection';

const TABLE_NAME = 'id_attributes';
const CONNECT_TABLE_NAME = 'id_attributes_connect';

export class IdAttribute extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['walletId'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				type: { type: 'string' },
				name: { type: 'string' },
				value: { type: 'string' },
				documentId: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('./wallet');
		const IdAttributeType = require('./id-attribute-type');
		const Document = require('./document');
		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			},
			type: {
				relation: Model.BelongsToOneRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.type`,
					extra: ['order', 'role'],
					to: `${IdAttributeType.tableName}.key`
				}
			},
			children: {
				relation: Model.ManyToManyRelation,
				modelClass: IdAttribute,
				from: `${TABLE_NAME}.id`,
				through: {
					from: `${CONNECT_TABLE_NAME}.parentId`,
					to: `${CONNECT_TABLE_NAME}.childId`
				},
				to: `${TABLE_NAME}.id`
			},
			parents: {
				relation: Model.ManyToManyRelation,
				modelClass: IdAttribute,
				from: `${TABLE_NAME}.id`,
				through: {
					from: `${CONNECT_TABLE_NAME}.childId`,
					extra: ['order', 'role'],
					to: `${CONNECT_TABLE_NAME}.parentId`
				},
				to: `${TABLE_NAME}.id`
			},
			document: {
				relation: Model.HasOneRelation,
				modelClass: Document,
				from: `${TABLE_NAME}.id`,
				to: `${Document.tableName}.id`
			}
		};
	}
}

export default IdAttribute;
