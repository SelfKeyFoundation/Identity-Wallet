const BaseModel = require('./base');
const { Model, transaction } = require('objection');
const TABLE_NAME = 'wallets';
class Wallet extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['publicKey', 'privateKey'],
			properties: {
				id: { type: 'integer' },
				name: { type: 'string' },
				publicKey: { type: 'string' },
				privateKey: { type: 'string' },
				keystoreFilePath: { type: 'string' },
				profilePicture: { type: 'binary' },
				isSetupFinished: { type: 'integer' },
				profile: { type: 'string' },
				createdAt: { type: 'integer' },
				updatedAt: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const WalletSetting = require('./wallet-setting');
		const WalletToken = require('./wallet-token');
		const IdAttribute = require('./id-attribute');
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
			}
		};
	}

	static async create(itm) {
		const tx = transaction.start(this.knex());
		try {
			let itm = await this.query(tx).graphInsertAndFetch({
				...itm,
				setting: {
					showDesktopNotification: 1
				},
				tokens: [
					{
						tokenId: 1
					}
				]
			});
			await tx.commit();
			return itm;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static findActive() {
		return this.findAll().where({ isSetupFinished: 1 });
	}

	static findAll() {
		return this.query().whereNotNull('keystoreFilePath');
	}

	static findByPublicKey(publicKey) {
		return this.query()
			.findOne()
			.where({ publicKey });
	}

	static updateProfilePicture({ id, profilePicture }) {
		return this.query().patchAndFetchById(id, { profilePicture });
	}

	static async selectProfilePictureById(id) {
		let itm = await this.query().findById(id);
		if (!itm) return null;
		return itm.profilePicture;
	}

	static async addInitialIdAttributesAndActivate(id, initialIdAttributes) {
		const tx = transaction.start(this.knex());
		try {
			const IdAttributes = require('./id-attribute');
			//TODO implement
			const attributes = await IdAttributes.genInitial(id, initialIdAttributes, tx);
			let wallet = await this.query(tx).graphUpsertAndFetch({
				id,
				isSetupFinished: 1,
				idAttributes: attributes
			});
			tx.commit();
			return wallet;
		} catch (error) {
			tx.rollback();
			throw error;
		}
	}

	static async editImportedIdAttributes(id, initialIdAttributes) {
		const tx = transaction.start(this.knex());
		try {
			const IdAttributes = require('./id-attribute');
			const attributes = await IdAttributes.initializeImported(id, initialIdAttributes, tx);
			let wallet = await this.query(tx).graphUpsertAndFetch({
				id,
				isSetupFinished: 1,
				idAttributes: attributes
			});
			tx.commit();
			return wallet;
		} catch (error) {
			tx.rollback();
			throw error;
		}
	}
}

module.exports = Wallet;
