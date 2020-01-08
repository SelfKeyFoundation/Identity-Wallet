/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('wallets', t => {
			t.string('path');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('wallets', t => {
		t.dropColumn('path');
	});
};
