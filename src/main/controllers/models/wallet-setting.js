const { knex, sqlUtil } = require('../../services/knex');
const TABLE_NAME = 'wallet_settings';

module.exports = {
	findByWalletId: (walletId, tx) => sqlUtil.select(TABLE_NAME, '*', { walletId }, tx),

	updateById: (id, data, tx) => sqlUtil.updateById(TABLE_NAME, id, data, tx)
};
