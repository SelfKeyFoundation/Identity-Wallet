/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.createTable('repository', t => {
		t.increments('id');
		t.integer('walletId')
			.notNullable()
			.references('wallets.id');
		t.string('url');
		t.string('name');
		t.boolean('eager').defaultTo(false);
		t.integer('expires');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('repository');
};
