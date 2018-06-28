exports.up = async (knex, Promise) => {
	await knex.schema.table('guide_settings', t => {
		t.integer('crashReportAgreement');
	});
};

exports.down = async (knex, Promise) => {};
