/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.dropTable('guide_settings');
		await knex.schema.createTable('guide_settings', table => {
			table.increments('id');
			table.integer('guideShown').defaultTo(0);
			table.integer('icoAdsShown').defaultTo(0);
			table.integer('termsAccepted').defaultTo(0);
			table.integer('crashReportAgreement').defaultTo(0);
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		});

		await knex('guide_settings').insert({
			guideShown: 0,
			icoAdsShown: 0,
			termsAccepted: 0,
			crashReportAgreement: 0,
			createdAt: new Date().getTime()
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('guide_settings', t => {
		t.dropColumn('crashReportAgreement');
	});
};
