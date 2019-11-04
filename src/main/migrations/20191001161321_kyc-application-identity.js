/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.alterTable('kyc_applications', t => {
			t.string('identityId');
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
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {};
