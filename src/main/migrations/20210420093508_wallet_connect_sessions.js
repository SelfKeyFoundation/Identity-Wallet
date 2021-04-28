exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('wallet_connect_sessions', t => {
			t.increments('id');
			t.string('address');
			t.string('session');
			t.string('name');
			t.string('url');
			t.string('icon');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('wallet_connect_sessions');
};
