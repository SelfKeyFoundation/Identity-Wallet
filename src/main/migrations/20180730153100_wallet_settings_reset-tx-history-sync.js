/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex('wallet_settings').update('txHistoryLastSyncedBlock', 0);
};

exports.down = async (knex, Promise) => {};
