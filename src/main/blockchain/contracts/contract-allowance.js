import BaseModel from '../../common/base-model';
import { Model } from 'objection';
import { isDevMode, isTestMode } from 'common/utils/common';
const env = isTestMode() ? 'test' : isDevMode() ? 'development' : 'production';
const TABLE_NAME = 'contract_allowance';

export class ContractAllowance extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['contractAddress', 'tokenAddress', 'walletId'],
			properties: {
				id: { type: 'integer' },
				contractAddress: { type: 'string' },
				tokenAddress: { type: 'string' },
				tokenDecimals: { type: 'integer', default: 18 },
				allowanceAmount: { type: 'string' },
				walletId: { type: 'integer' },
				env: { type: 'string', enum: ['development', 'production', 'test'] }
			}
		};
	}
	static get relationMappings() {
		const Wallet = require('../../wallet/wallet').default;

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

	static findAll(where = {}) {
		return this.query().where({ ...where, env });
	}

	static findById(id) {
		return this.query().findById(id);
	}

	static create(data) {
		return this.query().insertAndFetch({ ...data, env });
	}

	static updateById(id, data) {
		return this.query().patchAndFetchById(id, data);
	}
}

export default ContractAllowance;
