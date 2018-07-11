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
		const tx = await transaction.start(this.knex());

		try {
			let insertedItm = await this.query(tx).insertGraphAndFetch(
				{
					...itm,
					setting: {
						sowDesktopNotification: 1
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
			console.error(error);
			await tx.rollback(error);
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

	static async addInitialIdAttributesAndActivate(id, initialIdAttributes) {
		const tx = await transaction.start(this.knex());
		try {
			const IdAttributes = require('./id-attribute');
			const attributes = await IdAttributes.genInitial(id, initialIdAttributes, tx);
			let wallet = await this.query(tx).upsertGraphAndFetch({
				id,
				isSetupFinished: 1,
				idAttributes: attributes
			});
			await tx.commit();
			return wallet;
		} catch (error) {
			console.error(error);
			await tx.rollback(error);
			throw error;
		}
	}

	static async editImportedIdAttributes(id, initialIdAttributes) {
		const tx = await transaction.start(this.knex());
		try {
			const IdAttributes = require('./id-attribute');
			const attributes = await IdAttributes.initializeImported(id, initialIdAttributes, tx);
			let wallet = await this.query(tx).upsertGraphAndFetch({
				id,
				isSetupFinished: 1,
				idAttributes: attributes
			});
			await tx.commit();
			return wallet;
		} catch (error) {
			await tx.rollback(error);
			throw error;
		}
	}
}

module.exports = Wallet;
