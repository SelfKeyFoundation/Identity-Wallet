/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		const wallets = await knex('wallets').select();
		wallets.map(async wallet => {
			if (wallet.publicKey.indexOf('0x') === -1) {
				await knex('wallets')
					.update({ publicKey: `0x${wallet.publicKey}` })
					.where({ id: wallet.id });
			}
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	const wallets = await knex('wallets').select();
	wallets.map(async wallet => {
		await knex('wallets')
			.update({ publicKey: wallet.publicKey.substring(2) })
			.where({ id: wallet.id });
	});
};
