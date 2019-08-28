import { Model, transaction } from 'objection';
import { Logger } from 'common/logger';
import BaseModel from '../common/base-model';
import IdAttribute from '../identity/id-attribute';
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
				address: { type: 'string' },
				privateKey: { type: 'string' },
				keystoreFilePath: { type: 'string' },
				type: { type: 'string' },
				path: { type: 'string' }
			}
		};
	}

	static get relationMappings() {
		const WalletSetting = require('./wallet-setting').default;
		const WalletToken = require('./wallet-token').default;
		const IdAttribute = require('../identity/id-attribute').default;
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
		itm.address = itm.address.toLowerCase();
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

	static async findActive() {
		const wallets = await this.query()
			.select()
			.eager('identities');
		return wallets.filter(w => {
			const identities = w.identities.filter(idnt => idnt.isSetupFinished);
			return !!identities.length;
		});
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

	static findByAddress(address) {
		return this.query().findOne({ address: address.toLowerCase() });
	}

	static async updateName({ id, name }) {
		let wallet = await this.query().patchAndFetchById(id, { name });
		return wallet;
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

	static async addInitialIdAttributesAndActivate(id, initialIdAttributesValues) {
		for (let key in initialIdAttributesValues) {
			await IdAttribute.create({
				walletId: id,
				typeId: 1,
				data: { [key]: initialIdAttributesValues[key] }
			});
		}
	}
}

export default Wallet;
