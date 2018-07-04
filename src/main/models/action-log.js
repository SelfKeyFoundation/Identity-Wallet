const { Model } = require('objection');
const BaseModel = require('./base');
const TABLE_NAME = 'action_logs';

class ActionLog extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['walletId', 'title'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				title: { type: 'string' },
				content: { type: 'string' },
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

	static create(itm, tx) {
		return this.query(tx).insertAndFetch(itm);
	}

	static findByWalletId(walletId, tx) {
		return this.query(tx).where({ walletId });
	}
}

module.exports = ActionLog;
