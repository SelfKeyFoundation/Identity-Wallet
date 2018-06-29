exports.up = async (knex, Promise) => {
	await knex.schema.table('wallet_settings', t => {
		t.integer('previousTransactionCount');
	});
};

exports.down = async (knex, Promise) => {};
