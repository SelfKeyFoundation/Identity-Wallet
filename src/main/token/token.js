import BaseModel from '../common/base-model';
import CONFIG from 'common/config';

const TABLE_NAME = 'tokens';

export class Token extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['symbol', 'decimal', 'address'],
			properties: {
				id: { type: 'integer' },
				symbol: { type: 'string' },
				decimal: { type: 'integer' },
				networkId: { type: 'integer' },
				type: { type: 'string', default: 'erc-20' },
				address: { type: 'string' },
				icon: { type: 'binary' },
				isCustom: { type: 'integer' }
			}
		};
	}

	static create(itm) {
		return this.query().insertAndFetch({ ...itm, networkId: CONFIG.chainId });
	}

	static update(itm) {
		return this.query().patchAndFetchById(itm.id, itm);
	}

	static findAll() {
		return this.query().where({ networkId: CONFIG.chainId });
	}

	static findByAddress(address) {
		return this.query().where({ address, networkId: CONFIG.chainId });
	}

	static findBySymbol(symbol) {
		return this.query().where({
			symbol: (symbol || '').toUpperCase(),
			networkId: CONFIG.chainId
		});
	}

	static findOneBySymbol(symbol) {
		return this.query().findOne({
			symbol: (symbol || '').toUpperCase(),
			networkId: CONFIG.chainId
		});
	}
}

export default Token;
