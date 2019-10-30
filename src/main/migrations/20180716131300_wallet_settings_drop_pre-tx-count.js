/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('wallet_settings', t => {
			t.dropColumn('previousTransactionCount');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('wallet_settings', t => {
		t.integer('previousTransactionCount');
	});
};
