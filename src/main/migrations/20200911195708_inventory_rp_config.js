exports.up = async knex => {
	try {
		await knex.schema.table('inventory', t => {
			t.string('relyingPartyConfig').defaultTo('{}');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async knex => {};
