/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.alterTable('identities', t => {
			t.string('positions')
				.notNullable()
				.defaultTo('[]');
			t.float('equity')
				.notNullable()
				.defaultTo(0);
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {};
