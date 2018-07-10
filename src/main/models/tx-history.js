const BaseModel = require('./base');
const isSyncing = require('../controllers/tx-history-service').isSyncing;

const TABLE_NAME = 'tx_history';

// TODO copy in utils when sql-util-refactor will be finished
let paginator = knex => {
	return async (query, options = {}) => {
		const perPage = options.perPage || 10;
		let page = options.page || 1;

		const countQuery = query.clone().count();

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
			console.log(error);
			throw error;
		}
	};
};
class TxHistory extends BaseModel {
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
				blockNumber: { type: 'integer' },
				timeStamp: { type: 'integer' },
				nonce: { type: 'ingeger' },
				blockHash: { type: 'string' },
				contractAddress: { type: 'string' },
				from: { type: 'string' },
				to: { type: 'string' },
				value: { type: 'integer' },
				tokenName: { type: 'string' },
				tokenSymbol: { type: 'string' },
				tokenDecimal: { type: 'integer' },
				transactionIndex: { type: 'integer' },
				gas: { type: 'integer' },
				gasPrice: { type: 'integer' },
				cumulativeGasUsed: { type: 'integer' },
				gasUsed: { type: 'integer' },
				input: { type: 'string' },
				confirmations: { type: 'integer' },
				isError: { type: 'integer' },
				txReceiptStatus: { type: 'integer' },
				networkId: { type: 'integer' }
			}
		};
	}

	static async addOrUpdate(data) {
		let record = await this.query().findOne({ hash: data.hash });
		if (record) return this.query().patchAndFetchById(record.id, data);
		return this.query().insertAndFetch(data);
	}

	static async findByPublicKey(publicKey, pager) {
		publicKey = publicKey.toLowerCase();
		let query = this.query()
			.where({ from: publicKey })
			.orWhere({ to: publicKey })
			.orderBy('timeStamp', 'desc');
		return paginator(this.knex())(query, pager).then(data => ({
			...data,
			isSyncing: isSyncing(publicKey)
		}));
	}

	static async findByPublicKeyAndTokenSymbol(publicKey, tokenSymbol, pager) {
		publicKey = publicKey.toLowerCase();
		let query = this.query()
			.where({ from: publicKey, tokenSymbol })
			.orWhere({ to: publicKey, tokenSymbol })
			.orderBy('timeStamp', 'desc');
		return paginator(this.knex())(query, pager).then(data => ({
			...data,
			isSyncing: isSyncing(publicKey)
		}));
	}

	static async findByPublicKeyAndContractAddress(publicKey, contractAddress, pager) {
		publicKey = publicKey.toLowerCase();
		let query = this.query()
			.where({ from: publicKey, contractAddress })
			.orWhere({ to: publicKey, contractAddress })
			.orderBy('timeStamp', 'desc');
		return paginator(this.knex())(query, pager).then(data => ({
			...data,
			isSyncing: isSyncing(publicKey)
		}));
	}
}

module.exports = TxHistory;
