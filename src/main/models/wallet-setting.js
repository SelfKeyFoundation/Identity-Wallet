const { Model } = require('objection');
const BaseModel = require('./base');
const TABLE_NAME = 'wallet_settings';

class WalletSetting extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['walletId'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				showDesktopNotifications: { type: 'integer' },
				previousTransactionCount: { type: 'integer' },
				txHistoryLastSyncedBlock: { type: 'integer' },
				airDropCode: { type: 'integer' },
				createdAt: { type: 'integer' },
				updatedAt: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('./wallet');
		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			}
		};
	}

	static create(itm) {
		return this.query().insertAndFetch(itm);
	}

	static findByWalletId(walletId) {
		return this.query().where({ walletId });
	}

	static updateById(id, itm) {
		return this.query().patchAndFetchById(id, itm);
	}
}

module.exports = WalletSetting;
