const { knex } = require('../../services/knex');
const TABLE_NAME = 'wallet_settings';

module.exports = () => ({
	findByWalletId: walletId =>
		knex(TABLE_NAME)
			.where({ walletId })
			.select(),

	edit: data =>
		knex(TABLE_NAME)
			.where('id', data.id)
			.update(data)
});
