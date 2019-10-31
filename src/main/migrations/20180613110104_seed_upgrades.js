/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		const rowCount = await knex('seed').count('id as countId');

		await knex.schema.dropTable('seed');

		await knex.schema.createTable('seed', table => {
			table.string('name');
			table.timestamp('appliedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
		});

		if (rowCount[0].countId > 0) {
			await knex('seed').insert({
				name: 'init'
			});
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	const rowCount = await knex('seed').count('name as countName');

	if (rowCount[0].countName > 1) {
		throw new Error('Data will be lost in seed table. Aborting.');
	}

	await knex.schema.dropTable('seed');

	await knex.schema.createTable('seed', table => {
		table.increments('id');
		table.integer('init');
	});

	if (rowCount[0].countName > 0) {
		await knex('seed').insert({
			init: 1
		});
	}
};
