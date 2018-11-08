/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.createTable('repository', t => {
		t.increments('id');
		t.string('url');
		t.string('name');
		t.boolean('eager').defaultTo(false);
		t.string('content').defaultTo('{}');
		t.integer('expires');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});

	await knex.schema.createTable('ui_schema', t => {
		t.increments('id');
		t.integer('repository')
			.notNullable()
			.references('repository.id');
		t.integer('attributeType')
			.notNullable()
			.references('id_attribute_types.id');
		t.string('url');
		t.string('content');
		t.integer('expires');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});

	await knex.schema.createTable('json_schema', t => {
		t.increments('id');
		t.integer('defaultRepository').references('repository.id');
		t.integer('attributeType')
			.notNullable()
			.references('id_attribute_types.id');
		t.string('url');
		t.string('content');
		t.integer('expires');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('json_schema');
	await knex.schema.dropTable('ui_schema');
	await knex.schema.dropTable('repository');
};
