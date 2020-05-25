/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('wallets', t => {
			t.string('did');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	if (await knex.schema.hasColumn('wallets', 'did')) {
		await knex.schema.table('wallets', t => {
			t.dropColumn('did');
		});
	}
};
