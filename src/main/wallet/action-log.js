import { Model } from 'objection';
import BaseModel from '../common/base-model';

const TABLE_NAME = 'action_logs';

export class ActionLog extends BaseModel {
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
				content: { type: 'string' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('./wallet').default;
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

export default ActionLog;
