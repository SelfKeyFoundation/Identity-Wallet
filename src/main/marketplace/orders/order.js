import BaseModel from '../../common/base-model';
import { isDevMode, isTestMode } from 'common/utils/common';
const TABLE_NAME = 'marketplace_orders';
const env = isTestMode() ? 'test' : isDevMode() ? 'development' : 'production';
export class MarketplaceOrder extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['identityId', 'vendorId', 'itemId'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				identityId: { type: 'integer' },
				vendorId: { type: 'string' },
				itemId: { type: 'string' },
				applicationId: { type: 'string' },
				amount: { type: 'string' },
				env: { type: 'string', enum: ['development', 'production', 'test'] },
				productInfo: { type: 'string' },
				vendorName: { type: 'string' },
				status: { type: 'string' },
				statusMessage: { type: 'string' },
				did: { type: 'string' },
				vendorDID: { type: 'string' },
				affiliate1DID: { type: 'string' },
				affiliate2DID: { type: 'string' },
				allowanceHash: { type: 'string' },
				paymentHash: { type: 'string' },
				vendorWallet: { type: 'string' }
			}
		};
	}

	static findAll() {
		return this.query().where({ env });
	}

	static findById(id) {
		return this.query().findOne({ id, env });
	}

	static create(data) {
		return this.query().insertAndFetch({ ...data, env });
	}

	static updateById(id, data) {
		return this.query().patchAndFetchById(id, data);
	}
}

export default MarketplaceOrder;
