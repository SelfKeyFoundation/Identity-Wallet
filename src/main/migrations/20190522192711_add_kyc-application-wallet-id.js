/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.table('kyc_applications', t => {
		t.integer('walletId').references('wallets.id');
	});
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('kyc_applications', t => {
		t.dropColumn('walletId');
	});
};
