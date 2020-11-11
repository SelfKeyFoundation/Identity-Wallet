/* istanbul ignore file */

exports.up = async (knex, Promise) => {
	try {
		await knex.schema.alterTable('marketplace_orders', t => {
			t.string('cryptoCurrency')
				.notNullable()
				.defaultTo('KEY');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	try {
		await knex.schema.table('wallets', t => {
			t.dropColumn('cryptoCurrency');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};
