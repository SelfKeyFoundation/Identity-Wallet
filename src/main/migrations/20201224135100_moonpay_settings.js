/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('wallet_settings', t => {
			t.boolean('moonPayTermsAccepted').defaultsTo(false);
			t.string('moonPayLogin').defaultsTo(null);
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('wallet_settings', t => {
		t.dropColumn('moonPayTermsAccepted');
		t.dropColumn('moonPayLogin');
	});
};
