exports.up = async (knex, Promise) => {
	await knex.schema.table('guide_settings', t => {
		t.integer('crashReportAgreement');
	});
	const records = await knex('guide_settings').select();
	await knex('guide_settings')
		.update({ guideShown: 0, termsAccepted: 0 })
		.where({
			id: records[0].id
		});
};

exports.down = async (knex, Promise) => {};
