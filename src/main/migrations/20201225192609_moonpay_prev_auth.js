/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('wallet_settings', t => {
			t.boolean('moonPayPreviousAuth').defaultsTo(false);
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('wallet_settings', t => {
		t.dropColumn('moonPayPreviousAuth');
	});
};
