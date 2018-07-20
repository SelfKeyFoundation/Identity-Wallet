import BaseModel from './base';
import { Model } from 'objection';
import { Logger } from 'common/logger';
const log = new Logger('id-attribute');
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
			attributeType: {
				relation: Model.BelongsToOneRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.type`,
					to: `${IdAttributeType.tableName}.key`
				}
			},
			children: {
				relation: Model.ManyToManyRelation,
				modelClass: IdAttribute,
				join: {
					from: `${TABLE_NAME}.id`,
					through: {
						from: `${CONNECT_TABLE_NAME}.parentId`,
						extra: ['order', 'role'],
						to: `${CONNECT_TABLE_NAME}.childId`
					},
					to: `${TABLE_NAME}.id`
				}
			},
			parents: {
				relation: Model.ManyToManyRelation,
				modelClass: IdAttribute,
				join: {
					from: `${TABLE_NAME}.id`,
					through: {
						from: `${CONNECT_TABLE_NAME}.childId`,
						extra: ['order', 'role'],
						to: `${CONNECT_TABLE_NAME}.parentId`
					},
					to: `${TABLE_NAME}.id`
				}
			},
			document: {
				relation: Model.HasOneRelation,
				modelClass: Document,
				join: {
					from: `${TABLE_NAME}.id`,
					to: `${Document.tableName}.id`
				}
			}
		};
	}

	static async upsertInitial(walletId, initialIdAttributes, tx) {
		log.info('upsert initial attributes');
		const IdAttributeTypes = require('./id-attribute-type');
		let idAttributeTypes = await IdAttributeTypes.findInitial(tx);
		let attrNames = idAttributeTypes.map(({ key }) => key);
		let attrs = await this.query()
			.where({ walletId })
			.whereIn('name', attrNames);
		let update = {};
		attrs.forEach(attr => {
			if (!initialIdAttributes.hasOwnProperty(attr.name)) return;
			attr.value = initialIdAttributes[attr.name];
			update[attr.name] = attr;
		});
		for (let i in idAttributeTypes) {
			let type = idAttributeTypes[i];
			if (update[type.key]) {
				await this.query.update(update[type.key]);
				continue;
			}

			await this.query(tx).insert({
				walletId,
				type: type.key,
				name: type.key,
				value: initialIdAttributes[type.key]
			});
		}
	}

	static async findAllByWalletId(walletId) {
		let attributes = await this.query().eager(`[children, parents]`);
		return attributes.filter(attr => !attr.parents || !attr.parents.length);
	}
}

export default IdAttribute;
