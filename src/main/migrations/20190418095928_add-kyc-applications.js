/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.createTable('kyc_applications', t => {
		t.string('id');
		t.string('owner');
		t.string('scope');
		t.string('rpName');
		t.integer('currentStatus');
		t.string('currentStatusName');
		t.string('applicationDate');
		t.text('payments')
			.notNullable()
			.defaultTo('{}');
		t.string('nextRoute');
		t.integer('createdAt')
			.notNullable()
			.defaultTo(new Date().getTime());
		t.integer('updatedAt');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('kyc_applications');
};
