/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.table('marketplace_orders', t => {
		t.string('vendorWallet');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('marketplace_orders', t => {
		t.dropColumn('vendorWallet');
	});
};
