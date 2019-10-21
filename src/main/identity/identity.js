import { Model } from 'objection';
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
			isSetupFinished: { type: 'boolean', default: false }
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
			}
		};
	}

	static findAllByWalletId(walletId) {
		return this.query()
			.select()
			.where({ walletId });
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
