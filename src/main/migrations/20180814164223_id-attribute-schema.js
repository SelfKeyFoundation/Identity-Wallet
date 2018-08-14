exports.up = async (knex, Promise) => {
	await knex.schema.createTable('id_attribute_schemas', t => {
		t.string('type')
			.primary()
			.references('id_attribute_types.key');
		t.integer('expires');
		t.text('jsonSchema')
			.notNullable()
			.defaultTo('{}');
		t.text('uiSchema')
			.notNullable()
			.defaultTo('{}');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('id_attribute_schemas');
};
