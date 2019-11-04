/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('documents', t => {
			t.string('env');
		});
		await knex.schema.table('id_attribute_types', t => {
			t.string('env');
		});
		await knex.schema.table('id_attributes', t => {
			t.string('env');
		});
		await knex.schema.table('repository', t => {
			t.string('env');
		});
		await knex.schema.table('ui_schema', t => {
			t.string('env');
		});

		await knex('documents').update({ env: 'production' });
		await knex('id_attribute_types').update({ env: 'production' });
		await knex('id_attributes').update({ env: 'production' });
		await knex('repository').update({ env: 'production' });
		await knex('ui_schema').update({ env: 'production' });

		const now = Date.now();
		await knex('repository').insert({
			url: 'http://platform.selfkey.org/dev-repository.json',
			name: 'Selfkey.org',
			eager: true,
			content: '{}',
			expires: 0,
			createdAt: now,
			updatedAt: now,
			env: 'development'
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {};
