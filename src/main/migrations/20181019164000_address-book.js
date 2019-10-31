/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('address_book', t => {
			t.increments('id');
			t.integer('walletId')
				.notNullable()
				.references('wallets.id');
			t.string('label');
			t.string('address');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('address_book');
};
