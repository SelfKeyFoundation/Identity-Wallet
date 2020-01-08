import { Model, transaction } from 'objection';
import IdAttribute from './id-attribute';
import BaseModel from '../common/base-model';
import { formatDataUrl, bufferFromDataUrl } from 'common/utils/document';

const TABLE_NAME = 'identities';

export class Identity extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'integer' },
			walletId: { type: 'integer' },
			parentId: { type: ['integer', null] },
			rootIdentity: { type: 'boolean', default: true },
			name: { type: 'string' },
			type: { type: 'string' },
			profilePicture: { type: 'binary' },
			did: { type: 'string' },
			isSetupFinished: { type: 'boolean', default: false },
			positions: { type: 'array', default: [] },
			equity: { type: 'float', default: 0 }
		},
		required: ['walletId', 'type']
	};

	static get relationMappings() {
		const Wallet = require('../wallet/wallet').default;
		const IdAttribute = require('./id-attribute').default;
		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			},
			attributes: {
				relation: Model.HasManyRelation,
				modelClass: IdAttribute,
				join: {
					from: `${this.tableName}.id`,
					to: `${IdAttribute.tableName}.identityId`
				}
			},
			members: {
				relation: Model.HasManyRelation,
				modelClass: Identity,
				join: {
					from: `${this.tableName}.id`,
					to: `${this.tableName}.parentId`
				}
			},
			parent: {
				relation: Model.BelongsToOneRelation,
				modelClass: Identity,
				join: {
					from: `${this.tableName}.parentId`,
					to: `${this.tableName}.id`
				}
			}
		};
	}

	static findAllByWalletId(walletId, tx) {
		return this.query(tx)
			.select()
			.where({ walletId });
	}

	static findById(id, tx) {
		return this.query(tx).findById(id);
	}

	static create(itm, tx) {
		return this.query(tx).insertAndFetch(itm);
	}

	static async delete(id, tx) {
		const IdAttribute = require('./id-attribute').default;
		const initiator = !tx;
		tx = tx || (await transaction.start(this.knex()));
		try {
			const identity = await this.findById(id, tx).eager('[attributes, members]');
			await Promise.all(identity.members.map(m => this.delete(m.id, tx)));
			await Promise.all(identity.attributes.map(attr => IdAttribute.delete(attr.id, tx)));
			await this.query(tx).deleteById(id);
			if (initiator) {
				await tx.commit();
			}
			return identity;
		} catch (error) {
			if (initiator) {
				await tx.rollback();
			}
			throw error;
		}
	}

	static async selectProfilePictureById(id) {
		let itm = await this.query().findById(id);
		if (!itm) return null;
		return itm.profilePicture;
	}

	static async updateProfilePicture({ id, profilePicture }) {
		let identity = await this.query().patchAndFetchById(id, { profilePicture });
		return identity;
	}

	static async updateName({ id, name }) {
		let identity = await this.query().patchAndFetchById(id, { name });
		return identity;
	}

	static async updateSetup({ id, isSetupFinished }) {
		let identity = await this.query().patchAndFetchById(id, {
			isSetupFinished: !!isSetupFinished
		});
		return identity;
	}

	static async updateDID({ id, did }) {
		let identity = await this.query().patchAndFetchById(id, { did });
		return identity;
	}

	static async update(data) {
		let identity = await this.query().patchAndFetchById(data.id, data);
		return identity;
	}

	static async addInitialIdAttributesAndActivate(id, initialIdAttributesValues) {
		for (let key in initialIdAttributesValues) {
			await IdAttribute.create({
				identityId: id,
				typeId: 1,
				data: { [key]: initialIdAttributesValues[key] }
			});
		}
	}

	$parseDatabaseJson(json) {
		json = super.$parseDatabaseJson(json);
		json.profilePicture = formatDataUrl(json.profilePicture);
		return json;
	}

	$formatDatabaseJson(json) {
		json = super.$formatDatabaseJson(json);
		json.profilePicture = bufferFromDataUrl(json.profilePicture);
		return json;
	}
}

export default Identity;
