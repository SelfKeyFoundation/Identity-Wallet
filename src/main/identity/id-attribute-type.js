import _ from 'lodash';
import { transaction, Model } from 'objection';
import BaseModel from '../common/base-model';

const TABLE_NAME = 'id_attribute_types';

export class IdAttributeType extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'key';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['type', 'key'],
			properties: {
				key: { type: 'string' },
				category: { type: 'string' },
				type: { type: 'string' },
				entity: { type: 'array' },
				isInitial: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const IdAttributeSchema = require('./id-attribute-schema').default;
		return {
			schema: {
				relation: Model.HasOneRelation,
				modelClass: IdAttributeSchema,
				join: {
					from: `${this.tableName}.key`,
					to: `${IdAttributeSchema.tableName}.type`
				}
			}
		};
	}

	static create(data) {
		const type = Array.isArray(data.type) ? data.type[0] : data.type;
		const dataToSave = {
			..._.pick(data, 'key', 'entity', 'category'),
			type
		};
		return this.query().insertAndFetch(dataToSave);
	}

	static findAll(tx) {
		return this.query(tx);
	}

	static findInitial(tx) {
		return this.findAll(tx).where({ isInitial: 1 });
	}

	static async import(attributeTypes) {
		const tx = await transaction.start(this.knex());

		try {
			let attrs = await this.findAll(tx);
			let existing = attrs.reduce((acc, attr) => {
				acc[attr.key] = true;
				return acc;
			}, {});

			let toImport = attributeTypes.reduce(
				(acc, attr) => {
					if (Array.isArray(attr.type)) attr.type = attr.type[0];
					if (existing[attr.key]) acc.update.push(attr);
					else acc.insert.push(attr);
					return acc;
				},
				{ update: [], insert: [] }
			);

			await this.insertMany(toImport.insert, tx);
			await this.updateMany(toImport.update, tx);
			await tx.commit();
		} catch (error) {
			await tx.rollback(error);
			throw error;
		}
	}
}

export default IdAttributeType;
