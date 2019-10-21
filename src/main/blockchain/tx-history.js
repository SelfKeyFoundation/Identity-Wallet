import { Logger } from 'common/logger';
import BaseModel from '../common/base-model';
import { getGlobalContext } from 'common/context';

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
				gasPrice: { type: 'number' },
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
		let now = new Date().getTime();
		data.timeStamp = data.timeStamp || now;
		data.createdAt = data.createdAt || now;
		data.from = data.from.toLowerCase();
		data.to = data.to.toLowerCase();

		let record = await this.query().findOne({ hash: data.hash });
		if (record) return this.query().patchAndFetchById(record.id, data);
		return this.query().insertAndFetch(data);
	}

	static findByPublicKey(address) {
		address = address.toLowerCase();
		return this.query()
			.where({ from: address })
			.orWhere({ to: address })
			.orderBy('timeStamp', 'desc');
	}

	static findByPublicKeyAndTokenSymbol(address, tokenSymbol, pager) {
		address = address.toLowerCase();
		let query = this.query()
			.where({ from: address, tokenSymbol })
			.orWhere({ to: address, tokenSymbol })
			.orderBy('timeStamp', 'desc');
		return paginator(this.knex())(query, pager);
	}

	static findByPublicKeyAndContractAddress(address, contractAddress, pager) {
		address = address.toLowerCase();
		let query = this.query()
			.where({ from: address, contractAddress })
			.orWhere({ to: address, contractAddress })
			.orderBy('timeStamp', 'desc');
		return paginator(this.knex())(query, pager);
	}

	/**
	 * Remove transaction by id
	 *
	 * @param {string} id
	 * @return {Promise}
	 */
	static removeTxById(id) {
		return this.query()
			.findOne({ id })
			.del();
	}

	/**
	 * Find pending transactions and get updated information from the blockchain
	 *
	 * @param {string} address
	 * @return {Promise}
	 */
	static async updatePendingTxsByPublicKey(address) {
		address = address.toLowerCase();
		const query = await this.query()
			.whereNull('blockNumber')
			.andWhere(function() {
				this.where({ from: address }).orWhere({ to: address });
			});

		await Promise.all(query.map(this.syncTx.bind(this)));
	}

	/**
	 * Sync transaction with the blockchain
	 * Actions:
	 * - Remove failed transactions from the local db
	 * - Update blockHash and blockNumber for transaction pending in db and success status in the blockchain
	 *
	 * @param {Transaction} localTx
	 * @return {Promise}
	 */
	static async syncTx(localTx) {
		const web3Service = getGlobalContext().web3Service;

		const tx = await web3Service.getTransaction(localTx.hash);
		const status = await web3Service.getTransactionStatus(tx);

		if (status === 'failed') {
			await this.query().patchAndFetchById(localTx.id, {
				isError: 1
			});
		} else if (status === 'success') {
			await this.query().patchAndFetchById(localTx.id, {
				blockHash: tx.blockHash,
				blockNumber: tx.blockNumber
			});
		}
	}
}

export default TxHistory;
