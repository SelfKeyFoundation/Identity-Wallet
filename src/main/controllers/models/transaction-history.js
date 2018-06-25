const { knex } = require('../../services/knex');
const TABLE_NAME = 'transactions_history';

module.exports = () => ({
	findAll: () => knex(TABLE_NAME).select(),

	findByWalletId: walletId => knex(TABLE_NAME).where({ walletId: walletId }),

	findByWalletIdAndTokenId: (walletId, tokenId) =>
		knex(TABLE_NAME).where({ walletId: walletId, tokenId: tokenId })
});
