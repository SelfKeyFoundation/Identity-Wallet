/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.alterTable('kyc_applications', t => {
		t.string('identityId').references('identity.id');
	});
	const applications = await knex('kyc_applications').select();
	const identities = await knex('identities')
		.select()
		.where({ type: 'individual' });
	if (!applications.length || !identities.length) return;
	const mapIdentities = identities.reduce((acc, curr) => {
		acc[curr.walletId] = curr;
		return acc;
	}, {});
	await Promise.all(
		applications.map(async application => {
			await knex('kyc_applications')
				.update({
					identityId: mapIdentities[application.walletId].id
				})
				.where({ walletId: application.walletId });
		})
	);
};

exports.down = async (knex, Promise) => {};
