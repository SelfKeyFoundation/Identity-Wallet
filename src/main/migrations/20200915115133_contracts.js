exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('contracts', t => {
			t.increments('id');
			t.string('name');
			t.string('address');
			t.string('type');
			t.boolean('deprecated');
			t.boolean('active');
			t.text('abi');
			t.text('config');
			t.string('env');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('contracts');
};
