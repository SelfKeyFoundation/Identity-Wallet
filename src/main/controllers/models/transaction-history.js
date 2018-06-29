const { knex, sqlUtil } = require('../../services/knex');
const TABLE_NAME = 'transactions_history';

module.exports = {
	create: (data, tx) => sqlUtil.insertAndSelect(TABLE_NAME, data, tx),
	findAll: tx => sqlUtil.select(TABLE_NAME, '*', null, tx),

	findByWalletId: (walletId, tx) => sqlUtil.select(TABLE_NAME, '*', { walletId }, tx),

	findByWalletIdAndTokenId: (walletId, tokenId, tx) =>
		sqlUtil.select(TABLE_NAME, '*', { walletId, tokenId }, tx)
};
