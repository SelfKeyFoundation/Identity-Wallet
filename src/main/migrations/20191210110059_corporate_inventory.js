exports.up = async knex => {
	await knex.schema.alterTable('vendors', t => {
		t.string('entityTypes').defaultTo('[individual]');
	});
	await knex.schema.alterTable('inventory', t => {
		t.string('entityType').defaultTo('individual');
	});
};

exports.down = async knex => {};
