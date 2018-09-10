import BaseModel from '../common/base-model';
import { Model } from 'objection';

const TABLE_NAME = 'login_attempts';

export class LoginAttempt extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['walletId'],
		properties: {
			id: { type: 'integer' },
			walletId: { type: 'integer' },
			websiteName: { type: 'string' },
			websiteUrl: {},
			apiUrl: { type: 'string' },
			success: { type: 'boolean' },
			errorCode: { type: 'string' },
			errorMessage: { type: 'string' },
			signup: { type: 'boolean' }
		}
	};
	static get relationMappings() {
		const Wallet = require('../wallet/wallet').default;
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
}

export default LoginAttempt;
