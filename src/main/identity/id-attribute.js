import { Model, transaction } from 'objection';
import _ from 'lodash';
import BaseModel from '../common/base-model';
import Document from './document';
import { isDevMode } from 'common/utils/common';

const env = isDevMode() ? 'development' : 'production';
const TABLE_NAME = 'id_attributes';

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
			required: ['identityId', 'typeId'],
			properties: {
				id: { type: 'integer' },
				name: { type: 'string' },
				identityId: { type: 'integer' },
				typeId: { type: 'integer' },
				data: { type: 'object' },
				env: { type: 'string', enum: ['production', 'development'], default: env }
			}
		};
	}

	static get relationMappings() {
		const Identity = require('./identity').default;
		const IdAttributeType = require('./id-attribute-type').default;
		const Document = require('./document').default;
		return {
			identity: {
				relation: Model.BelongsToOneRelation,
				modelClass: Identity,
				join: {
					from: `${this.tableName}.identityId`,
					to: `${Identity.tableName}.id`
				}
			},
			attributeType: {
				relation: Model.BelongsToOneRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.typeId`,
					to: `${IdAttributeType.tableName}.id`
				}
			},
			documents: {
				relation: Model.HasManyRelation,
				modelClass: Document,
				join: {
					from: `${this.tableName}.id`,
					to: `${Document.tableName}.attributeId`
				}
			}
		};
	}

	static async create(attr) {
		const tx = await transaction.start(this.knex());
		attr = { ...attr };
		try {
			let newAttr = await this.query(tx).insertAndFetch(
				_.omit({ ...attr, env }, ['documents'])
			);
			attr.id = newAttr.id;
			attr = await this.update(attr, tx);
			await tx.commit();
			return attr;
		} catch (error) {
			await tx.rollback(error);
			throw error;
		}
	}

	static async update(attr, txRunning) {
		const tx = txRunning || (await transaction.start(this.knex()));
		try {
			const documents = await Promise.all(
				(attr.documents || []).map(async doc => {
					let newDoc = await Document.query(tx).upsertGraphAndFetch({
						...doc,
						attributeId: attr.id
					});
					if (doc['#id']) {
						newDoc['#id'] = doc['#id'];
					}
					return newDoc;
				})
			);
			attr = await this.query(tx).upsertGraphAndFetch({ ...attr, documents });
			if (!txRunning) await tx.commit();
			return attr;
		} catch (error) {
			if (!txRunning) await tx.rollback();
			throw error;
		}
	}

	static findAllByIdentityId(identityId) {
		return this.query().where({ identityId });
	}

	static async delete(id) {
		const tx = await transaction.start(this.knex());
		try {
			let attr = await this.query(tx)
				.findById(id)
				.eager('documents');
			// TODO: fix for multiple documents
			if (attr.documents) await Promise.all(attr.documents.map(d => d.$query(tx).delete()));
			await attr.$query(tx).delete();
			await tx.commit();
			return attr;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static findByTypeUrls(identityId, urls = []) {
		return this.query()
			.select(`${TABLE_NAME}.*`)
			.join('id_attribute_types', `${TABLE_NAME}.typeId`, 'id_attribute_types.id')
			.where({ identityId, [`${TABLE_NAME}.env`]: env })
			.whereIn('id_attribute_types.url', urls);
	}
}
export default IdAttribute;
