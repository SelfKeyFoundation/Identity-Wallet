/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('marketplace_orders', t => {
			t.string('vendorWallet');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('marketplace_orders', t => {
		t.dropColumn('vendorWallet');
	});
};
