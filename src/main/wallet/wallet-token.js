import BaseModel from '../common/base-model';
import { Model, transaction } from 'objection';
import CONFIG from 'common/config';

const TABLE_NAME = 'wallet_tokens';

export class WalletToken extends BaseModel {
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
				walletId: { type: 'integer' },
				tokenId: { type: 'integer' },
				balance: { type: 'string' },
				hidden: { type: 'integer' },
				recordState: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('./wallet').default;
		const Token = require('../token/token').default;

		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			},
			token: {
				relation: Model.BelongsToOneRelation,
				modelClass: Token,
				join: {
					from: `${this.tableName}.tokenId`,
					to: `${Token.tableName}.id`
				}
			}
		};
	}
	static create(itm) {
		return this.query()
			.insertAndFetch(itm)
			.eager('token');
	}

	static update(itm) {
		return this.query().patchAndFetchById(itm.id, itm);
	}

	static async createWithNewToken(token, balance, walletId) {
		const tx = await transaction.start(this.knex());
		try {
			let wtoken = await this.query(tx)
				.insertGraphAndFetch({
					walletId,
					token,
					balance,
					recordState: 1
				})
				.eager('token');
			await tx.commit();
			return wtoken;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static find(where) {
		return this.query()
			.select(
				'wallet_tokens.id as id',
				'wallet_tokens.*',
				'token_prices.name',
				'token_prices.priceUSD',
				'tokens.symbol',
				'tokens.decimal',
				'tokens.address',
				'tokens.isCustom'
			)
			.leftJoin('tokens', 'tokenId', 'tokens.id')
			.leftJoin('token_prices', 'tokens.symbol', 'token_prices.symbol')
			.where('tokens.networkId', CONFIG.chainId)
			.where(where);
	}

	static findByWalletId(walletId, all = false) {
		const search = { walletId };
		if (!all) search.recordState = 1;
		return this.find(search);
	}

	static findByTokenId(tokenId, all = false) {
		const search = { tokenId };
		if (!all) search.recordState = 1;
		return this.find(search);
	}
}

export default WalletToken;
