/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex('wallet_settings').update('txHistoryLastSyncedBlock', 0);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {};
