import { Model, transaction } from 'objection';
import BaseModel from '../common/base-model';

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
			required: ['walletId', 'typeId'],
			properties: {
				id: { type: 'integer' },
				name: { type: 'string' },
				walletId: { type: 'integer' },
				typeId: { type: 'integer' },
				data: { type: 'object' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('../wallet/wallet').default;
		const IdAttributeType = require('./id-attribute-type').default;
		const Document = require('./document').default;
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
		try {
			attr = await this.query(tx).insertGraphAndFetch(attr);
			await tx.commit();
			return attr;
		} catch (error) {
			await tx.rollback(error);
			throw error;
		}
	}

	static async update(attr) {
		const tx = await transaction.start(this.knex());
		try {
			attr = await this.query(tx).upsertGraphAndFetch(attr);
			await tx.commit();
			return attr;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static findAllByWalletId(walletId) {
		return this.query().where({ walletId });
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

	static findByTypeUrls(walletId, urls = []) {
		return this.query()
			.select(`${TABLE_NAME}.*`)
			.join('id_attribute_types', `${TABLE_NAME}.typeId`, 'id_attribute_types.id')
			.where({ walletId })
			.whereIn('id_attribute_types.url', urls);
	}
}
export default IdAttribute;
