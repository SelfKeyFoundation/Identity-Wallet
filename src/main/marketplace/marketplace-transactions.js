import BaseModel from '../common/base-model';
const TABLE_NAME = 'marketplace-transactions';

export class MarketplaceTransactions extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['serviceOwner', 'serviceId', 'action'],
		properties: {
			id: { type: 'integer' },
			serviceOwner: { type: 'string' },
			serviceId: { type: 'string' },
			action: { type: 'string' },
			amount: { type: ['string', 'number'], default: '0' },
			gasPrice: { type: 'number', default: 0 },
			gasLimit: { type: 'number', default: 0 },
			networkId: { type: 'number' },
			blockchainTx: { type: 'array', default: [] },
			lastStatus: {
				type: 'string',
				enum: ['planned', 'pending', 'processing', 'success', 'failed'],
				default: 'planned'
			}
		}
	};

	static create(itm) {
		return this.query().insertAndFetch(itm);
	}

	static find(where = {}) {
		return this.query().where(where);
	}

	static updateById(id, data) {
		return this.query().patchAndFetchById(id, data);
	}
}

export default MarketplaceTransactions;
