exports.up = async (knex, Promise) => {
	await knex.schema.dropTable('exchange_data');
	await knex.schema.createTable('exchange_data', t => {
		t.string('name').primary();
		t.string('env').primary();
		t.string('data').notNullable();
		t.integer('createdAt')
			.notNullable()
			.defaultTo(new Date().getTime());
		t.integer('updatedAt');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('exchange_data');
	await knex.schema.createTable('exchange_data', t => {
		t.string('name').primary();
		t.string('data').notNullable();
		t.integer('createdAt')
			.notNullable()
			.defaultTo(new Date().getTime());
		t.integer('updatedAt');
	});
};
