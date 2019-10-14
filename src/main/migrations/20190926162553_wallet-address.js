/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.renameTable('wallets', 'wallets_old');
		await knex.schema.createTable('wallets', table => {
			table.increments('id');
			table.string('name');
			table
				.string('address')
				.unique()
				.notNullable();
			table.string('keystoreFilePath');
			table
				.string('profile')
				.notNullable()
				.defaultTo('local');
			table.string('path');
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		});

		let wallets = await knex('wallets_old').select();
		wallets = wallets.map(w => {
			const newW = { ...w };
			newW.address = w.publicKey;
			delete newW.publicKey;
			delete newW.profilePicture;
			delete newW.privateKey;
			delete newW.isSetupFinished;
			delete newW.did;
			return newW;
		});
		if (wallets.length) {
			await knex('wallets').insert(wallets);
		}
		await knex.schema.dropTable('wallets_old');
	} catch (error) {
		console.error(error);
	}
};

exports.down = async (knex, Promise) => {};
