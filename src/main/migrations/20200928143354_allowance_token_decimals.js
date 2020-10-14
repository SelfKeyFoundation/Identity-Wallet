exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('contract_allowance', t => {
			t.integer('tokenDecimals').defaultTo(18);
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {};
