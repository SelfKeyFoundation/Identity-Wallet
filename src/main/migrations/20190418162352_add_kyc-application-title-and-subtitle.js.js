/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.table('kyc_applications', t => {
		t.string('title');
		t.string('sub_title');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('kyc_applications', t => {
		t.dropColumn('title');
		t.string('sub_title');
	});
};
