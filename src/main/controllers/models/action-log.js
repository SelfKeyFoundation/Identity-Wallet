const { knex } = require('../../services/knex');

const TABLE_NAME = 'action_logs';

module.exports = () => ({
	add: item =>
		knex(TABLE_NAME).insert({
			...item,
			createdAt: new Date().getTime()
		}),
	findByWalletId: walletId =>
		knex(TABLE_NAME)
			.where({ walletId })
			.select()
});
