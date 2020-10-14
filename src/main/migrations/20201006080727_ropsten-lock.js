exports.up = async (knex, Promise) => {
	try {
		let token = await knex('tokens')
			.select()
			.where({ symbol: 'LOCK', networkId: 3 })
			.first();

		if (!token) {
			const inserted = await knex('tokens').insert({
				symbol: 'LOCK',
				networkId: 3,
				decimal: 18,
				type: 'erc-20',
				address: '0xe8348b237dee32a8e087932cde1786983d91a6e6',
				isCustom: 0,
				createdAt: Date.now()
			});

			if (!inserted.length) return;

			token = await knex('tokens')
				.select()
				.where({ id: inserted[0] })
				.first();
		}

		if (!token) {
			return;
		}

		let wallets = await knex('wallets').select();
		let walletTokens = await knex('wallet_tokens')
			.select()
			.where({ tokenId: token.id });
		wallets = wallets
			.map(w => w.id)
			.filter(id => !walletTokens.find(t => t.walletId === id))
			.map(walletId => ({
				walletId,
				tokenId: token.id,
				balance: '0',
				hidden: 0,
				recordState: 1,
				createdAt: Date.now()
			}));

		if (!wallets.length) return;
		await knex('wallet_tokens').insert(wallets);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {};
