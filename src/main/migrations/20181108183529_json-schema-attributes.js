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
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('repository');
};
