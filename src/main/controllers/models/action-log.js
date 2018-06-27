const { knex, sqlUtil } = require('../../services/knex');

const TABLE_NAME = 'action_logs';

module.exports = {
	TABLE_NAME,
	add: (item, tx) => sqlUtil.insert(TABLE_NAME, item, tx),
	findByWalletId: (walletId, tx) => sqlUtil.select(TABLE_NAME, '*', { walletId }, tx)
};
