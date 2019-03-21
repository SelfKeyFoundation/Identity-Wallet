/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.table('wallets', t => {
		t.string('path');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('wallets', t => {
		t.dropColumn('path');
	});
};
