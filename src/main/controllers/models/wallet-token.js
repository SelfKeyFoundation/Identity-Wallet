const { knex, sqlUtil } = require('../../services/knex');

const Token = require('./token');

const TABLE_NAME = 'wallet_tokens';

const mod = (module.exports = {
	create: (data, tx) =>
		sqlUtil
			.insertAndSelect(TABLE_NAME, { ...data, recordState: 1 }, tx)
			.then(rawWalletToken => mod.findOneByWalletId(rawWalletToken.id, tx)),

	update: (data, tx) => sqlUtil.updateById(TABLE_NAME, data, tx),

	createWithNewToken: (data, balance, walletId) =>
		knex.transaction(async trx => {
			let token = await Token.create(data, trx);
			let walletToken = await mod.create(
				{
					walletId: walletId,
					tokenId: token.id,
					balance: balance,
					recordState: 1,
					createdAt: Date.now()
				},
				trx
			);
			return walletToken;
		}),

	find: (where, tx) => {
		let query = knex(TABLE_NAME);

		if (tx) {
			query.transacting(tx);
		}

		return query
			.select(
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
			.where(where);
	},

	findOne: async (where, tx) => {
		let results = await mod.find(where, tx);
		if (!results || !results.length) return null;

		return results[0];
	},

	findOneById: (id, tx) => mod.findOne({ 'wallet_tokens.id': id, recordState: 1 }, tx),
	findOneByWalletId: (walletId, tx) => mod.findOne({ walletId, recordState: 1 }, tx),
	findByWalletId: (walletId, tx) => mod.find({ walletId, recordState: 1 }, tx)
});
