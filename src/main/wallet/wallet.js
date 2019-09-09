import { Model, transaction } from 'objection';
import { Logger } from 'common/logger';
import BaseModel from '../common/base-model';
import config from 'common/config';

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
				profile: { type: 'string' },
				path: { type: 'string' }
			}
		};
	}

	static get relationMappings() {
		const WalletSetting = require('./wallet-setting').default;
		const WalletToken = require('./wallet-token').default;
		const LoginAttempt = require('../lws/login-attempt').default;
		const Identity = require('../identity/identity').default;

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
			loginAttempts: {
				relation: Model.HasManyRelation,
				modelClass: LoginAttempt,
				join: {
					from: `${this.tableName}.id`,
					to: `${LoginAttempt.tableName}.walletId`
				}
			},
			identities: {
				relation: Model.HasManyRelation,
				modelClass: Identity,
				join: {
					from: `${this.tableName}.id`,
					to: `${Identity.tableName}.walletId`
				}
			}
		};
	}

	static async create(itm) {
		itm.publicKey = itm.publicKey.toLowerCase();
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
							tokenId: config.constants.primaryToken === 'KEY' ? 1 : 2
						}
					],
					identities: [
						{
							type: 'individual'
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
		return this.query().findOne({ publicKey: publicKey.toLowerCase() });
	}

	static async updateProfilePicture({ id, profilePicture }) {
		let wallet = await this.query().patchAndFetchById(id, { profilePicture });
		return wallet;
	}

	static async updateName({ id, name }) {
		let wallet = await this.query().patchAndFetchById(id, { name });
		return wallet;
	}

	static async updateSetup({ id, setup }) {
		let wallet = await this.query().patchAndFetchById(id, { isSetupFinished: setup ? 1 : 0 });
		return wallet;
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
