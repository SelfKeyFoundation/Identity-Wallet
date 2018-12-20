import { Model, transaction } from 'objection';
import { Logger } from 'common/logger';
import BaseModel from '../common/base-model';

const TABLE_NAME = 'wallets';
const log = new Logger('wallet-model');
export class Wallet extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			properties: {
				id: { type: 'integer' },
				name: { type: 'string' },
				publicKey: { type: 'string' },
				privateKey: { type: 'string' },
				keystoreFilePath: { type: 'string' },
				profilePicture: { type: 'binary' },
				isSetupFinished: { type: 'integer' },
				profile: { type: 'string' }
			}
		};
	}

	static get relationMappings() {
		const WalletSetting = require('./wallet-setting').default;
		const WalletToken = require('./wallet-token').default;
		const IdAttribute = require('../identity/id-attribute').default;
		const LoginAttempt = require('../lws/login-attempt').default;

		return {
			setting: {
				relation: Model.HasOneRelation,
				modelClass: WalletSetting,
				join: {
					from: `${this.tableName}.id`,
					to: `${WalletSetting.tableName}.walletId`
				}
			},
			tokens: {
				relation: Model.HasManyRelation,
				modelClass: WalletToken,
				join: {
					from: `${this.tableName}.id`,
					to: `${WalletToken.tableName}.walletId`
				}
			},
			idAttributes: {
				relation: Model.HasManyRelation,
				modelClass: IdAttribute,
				join: {
					from: `${this.tableName}.id`,
					to: `${IdAttribute.tableName}.walletId`
				}
			},
			loginAttempts: {
				relation: Model.HasManyRelation,
				modelClass: LoginAttempt,
				join: {
					from: `${this.tableName}.id`,
					to: `${LoginAttempt.tableName}.walletId`
				}
			}
		};
	}

	static async create(itm) {
		const tx = await transaction.start(this.knex());

		try {
			let insertedItm = await this.query(tx).insertGraphAndFetch(
				{
					...itm,
					setting: {
						showDesktopNotification: 1
					},
					tokens: [
						{
							tokenId: 1
						}
					]
				},
				{ relate: true }
			);
			await tx.commit();
			return insertedItm;
		} catch (error) {
			log.error(error);
			await tx.rollback(error);
			throw error;
		}
	}

	static findActive() {
		return this.findAllWithKeyStoreFile().where({ isSetupFinished: 1 });
	}

	static findById(id) {
		return this.query().findById(id);
	}

	static findAllWithKeyStoreFile() {
		return this.query().whereNotNull('keystoreFilePath');
	}

	static findAll() {
		return this.query();
	}

	static findByPublicKey(publicKey) {
		return this.query().findOne({ publicKey });
	}

	static updateProfilePicture({ id, profilePicture }) {
		return this.query().patchAndFetchById(id, { profilePicture });
	}

	static async selectProfilePictureById(id) {
		let itm = await this.query().findById(id);
		if (!itm) return null;
		return itm.profilePicture;
	}

	async hasSignedUpTo(websiteUrl) {
		let logins = await this.$relatedQuery('loginAttempts')
			.where({
				websiteUrl,
				signup: true
			})
			.whereNull('errorCode');
		return !!logins.length;
	}

	async addLoginAttempt(attempt) {
		return this.$relatedQuery('loginAttempts').insert({ ...attempt, walletId: this.id });
	}
}

export default Wallet;
