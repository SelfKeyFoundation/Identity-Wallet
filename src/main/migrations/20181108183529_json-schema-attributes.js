/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	let now = Date.now();
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

	let repoIds = await knex('repository').insert({
		url: 'https://platform.selfkey.org/repository.json',
		name: 'Selfkey.org',
		eager: true,
		content: '{}',
		expires: 0,
		createdAt: now,
		updatedAt: now
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

	await knex.schema.renameTable('id_attribute_types', 'id_attribute_types_old');
	await knex.schema.createTable('id_attribute_types', t => {
		t.increments('id');
		t.string('url').notNullable();
		t.integer('schema')
			.notNullable()
			.references('json_schema.id');
		t.integer('defaultRepository').references('repository.id');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});

	let attributeTypes = await knex('id_attribute_types_old').select();

	attributeTypes = attributeTypes
		.map(t => {
			let url = `https://platform.selfkey.org/schema/attribute/${t.key.replace(
				/_/g,
				'-'
			)}.json`;
			let newType = {
				oldKey: t.key,
				type: {
					defaultRepository: repoIds[0],
					url,
					createdAt: t.createdAt,
					updatedAt: now
				},
				schema: {
					url,
					expires: now,
					createdAt: now
				}
			};

			return newType;
		})
		.map(async t => {
			let schemaIds = await knex('json_schema').insert(t.schema);
			t.type.schema = schemaIds[0];
			t.schema.id = schemaIds[0];
			let typeIds = await knex('id_attribute_types').insert(t.type);
			t.type.id = typeIds[0];
			return t;
		});

	await Promise.all(attributeTypes);
	await knex.schema.dropTable('id_attribute_types_old');
};

exports.down = async (knex, Promise) => {
	// TODO downgrade attribute types
	await knex.schema.dropTable('json_schema');
	await knex.schema.dropTable('ui_schema');
	await knex.schema.dropTable('repository');
};
