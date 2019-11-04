/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('login_attempts', t => {
			t.increments('id');
			t.integer('walletId')
				.notNullable()
				.references('wallets.id');
			t.string('websiteName');
			t.string('websiteUrl');
			t.string('apiUrl');
			t.boolean('success');
			t.string('errorCode');
			t.string('errorMessage');
			t.boolean('signup');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('login_attempts');
};
