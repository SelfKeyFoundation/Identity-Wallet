/* istanbul ignore file */
exports.up = async (knex, Promise) => {
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
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('address_book');
};
