/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('listing_exchanges', t => {
			t.increments('id');
			t.string('name');
			t.string('url');
			t.string('tradeUrl');
			t.string('region');
			t.string('pairs');
			t.string('comment');
			t.string('env');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error.stack);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('listing_exchanges');
};
