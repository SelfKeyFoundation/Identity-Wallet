import BaseModel from '../../common/base-model';
import { isDevMode, isTestMode } from 'common/utils/common';
const env = isTestMode() ? 'test' : isDevMode() ? 'development' : 'production';
const TABLE_NAME = 'contract_allowance';

export class Contract extends BaseModel {
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
				allowanceAmount: { type: 'string' },
				walletId: { type: 'integer' },
				env: { type: 'string', enum: ['development', 'production', 'test'] }
			}
		};
	}

	static findAll() {
		return this.query().where({ env });
	}

	static create(data) {
		return this.query().insertAndFetch({ ...data, env });
	}

	static updateById(id, data) {
		return this.query().patchAndFetchById(id, data);
	}
}

export default Contract;
