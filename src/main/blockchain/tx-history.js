import { Logger } from 'common/logger';
import BaseModel from '../common/base-model';

const log = new Logger('tx-history-model');
const TABLE_NAME = 'tx_history';

// TODO copy in utils when sql-util-refactor will be finished
export let paginator = knex => {
	return async (query, options = {}) => {
		const perPage = options.perPage || 10;
		let page = options.page || 1;

		const countQuery = query.clone().count('* as total');

		if (page < 1) {
			page = 1;
		}
		const offset = (page - 1) * perPage;

		query.offset(offset);

		if (perPage > 0) {
			query.limit(perPage);
		}

		try {
			const [data, countRows] = await Promise.all([query, countQuery]);
			const total = countRows[0].total;
			return {
				data,
				pagination: {
					total,
					perPage,
					currentPage: page,
					lastPage: Math.ceil(total / perPage),
					from: offset,
					to: offset + data.length
				}
			};
		} catch (error) {
			log.error(error);
			throw error;
		}
	};
};
export class TxHistory extends BaseModel {
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
				hash: { type: 'string' },
				blockNumber: { type: ['integer', 'null'] },
				timeStamp: { type: 'integer' },
				nonce: { type: 'ingeger' },
				blockHash: { type: ['string', 'null'] },
				contractAddress: { type: ['string', 'null'] },
				from: { type: 'string' },
				to: { type: 'string' },
				value: { type: 'number' },
				tokenName: { type: ['string', 'null'] },
				tokenSymbol: { type: ['string', 'null'] },
				tokenDecimal: { type: ['integer', 'null'] },
				transactionIndex: { type: ['integer', 'null'] },
				gas: { type: ['integer', 'null'] },
				gasPrice: { type: 'integer' },
				cumulativeGasUsed: { type: 'integer' },
				gasUsed: { type: ['integer', 'null'] },
				input: { type: 'string' },
				confirmations: { type: ['integer', 'null'] },
				isError: { type: ['integer', 'null'] },
				txReceiptStatus: { type: ['integer', 'null'] },
				networkId: { type: 'integer' }
			}
		};
	}

	static async addOrUpdate(data) {
		let record = await this.query().findOne({ hash: data.hash });
		if (record) return this.query().patchAndFetchById(record.id, data);
		return this.query().insertAndFetch(data);
	}

	static findByPublicKey(publicKey, pager) {
		publicKey = publicKey.toLowerCase();
		let query = this.query()
			.where({ from: publicKey })
			.orWhere({ to: publicKey })
			.orderBy('timeStamp', 'desc');
		return paginator(this.knex())(query, pager);
	}

	static findByPublicKeyAndTokenSymbol(publicKey, tokenSymbol, pager) {
		publicKey = publicKey.toLowerCase();
		let query = this.query()
			.where({ from: publicKey, tokenSymbol })
			.orWhere({ to: publicKey, tokenSymbol })
			.orderBy('timeStamp', 'desc');
		return paginator(this.knex())(query, pager);
	}

	static findByPublicKeyAndContractAddress(publicKey, contractAddress, pager) {
		publicKey = publicKey.toLowerCase();
		let query = this.query()
			.where({ from: publicKey, contractAddress })
			.orWhere({ to: publicKey, contractAddress })
			.orderBy('timeStamp', 'desc');
		return paginator(this.knex())(query, pager);
	}

	static removeNotMinedPendingTxsByPublicKey(publicKey, nonce) {
		publicKey = publicKey.toLowerCase();
		let query = this.query()
			.whereNull('blockNumber')
			.andWhere(function() {
				this.where('nonce', '<', nonce).orWhereNull('nonce');
			})
			.andWhere(function() {
				this.where({ from: publicKey }).orWhere({ to: publicKey });
			})
			.del();
		return query;
	}
}

export default TxHistory;
