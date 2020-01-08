/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
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
			t.string('jsonSchemaUrl');
			t.string('uiSchemaUrl');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('id_attribute_schemas');
};
