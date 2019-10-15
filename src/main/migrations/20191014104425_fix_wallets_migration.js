/* istanbul ignore file */

// Will try to fix removed wallets in previous migrations
exports.up = async (knex, Promise) => {
	const deleteAttribute = async attribute => {
		await knex('documents')
			.where({ attributeId: attribute.id })
			.del();
		await knex('id_attributes')
			.where({ id: attribute.id })
			.del();
	};

	const deleteIdentity = async identity => {
		const attributes = await knex('id_attributes')
			.select()
			.where({ identityId: identity.id });

		await Promise.all(attributes.map(deleteAttribute));
		await knex('marketplace_orders')
			.where({ identityId: identity.id })
			.del();
		await knex('identities')
			.where({ id: identity.id })
			.del();
	};

	const deleteWalletInfo = async wallet => {
		await knex('wallet_tokens')
			.where({ walletId: wallet.id })
			.del();
		await knex('address_book')
			.where({ walletId: wallet.id })
			.del();
		await knex('marketplace_orders')
			.where({ walletId: wallet.id })
			.del();
		await knex('wallet_settings')
			.where({ walletId: wallet.id })
			.del();

		const identities = await knex('identities')
			.select()
			.where({ walletId: wallet.id });

		await Promise.all(identities.map(deleteIdentity));
	};

	const insertNewWallet = async wallet => {
		const inserted = await knex('wallets').insert(wallet);
		if (!inserted[0]) {
			return;
		}
		const walletId = inserted[0];
		await knex('wallet_tokens').insert({ walletId, tokenId: 'KEY', createdAt: Date.now() });
		await knex('identities').insert({ walletId, type: 'individual', createdAt: Date.now() });
	};

	const convertOldWalletToNew = wallet => {
		const newW = { ...wallet };
		newW.address = wallet.publicKey;
		delete newW.publicKey;
		delete newW.profilePicture;
		delete newW.privateKey;
		delete newW.isSetupFinished;
		delete newW.did;
		return newW;
	};

	try {
		if (!(await knex.schema.hasTable('wallets_old'))) {
			return;
		}
		if (!(await knex.schema.hasTable('wallets'))) {
			await knex.schema.createTable('wallets', table => {
				table.increments('id');
				table.string('name');
				table
					.string('address')
					.unique()
					.notNullable();
				table.string('keystoreFilePath');
				table
					.string('profile')
					.notNullable()
					.defaultTo('local');
				table.string('path');
				table.integer('createdAt').notNullable();
				table.integer('updatedAt');
			});
		}
		let walletsOld = await knex('wallets_old').select();
		walletsOld = walletsOld.map(convertOldWalletToNew);
		let wallets = await knex('wallets').select();
		let insert = { wallets: walletsOld, newWallets: [], cleanup: [] };

		if (wallets.length) {
			// if new wallets were created, conflicts are possible, we do not touch duplicates
			wallets = wallets.reduce((acc, curr) => {
				acc[curr.address] = curr;
				acc[curr.id] = curr;
				return acc;
			}, {});

			insert = walletsOld.reduce(
				(acc, wallet) => {
					// if wallet with same address was created, disregard old wallet
					if (
						(wallets[wallet.address] && wallets[wallet.address].id === wallet.id) ||
						(wallets[wallet.address] && wallets[wallet.id])
					) {
						return acc;
					}
					if (wallets[wallet.address] && !wallets[wallet.id]) {
						acc.cleanup.push(wallet);
						return acc;
					}
					if (wallets[wallet.id]) {
						delete wallet.id;
						acc.newWallets.push(wallet);
						return acc;
					}
					acc.wallets.push(wallet);
					return acc;
				},
				{ wallets: [], newWallets: [], cleanup: [] }
			);
		}
		if (insert.cleanup.length) {
			await Promise.all(insert.cleanup.map(deleteWalletInfo));
		}
		if (insert.wallets.length) {
			await knex('wallets').insert(insert.wallets);
		}
		if (insert.newWallets.length) {
			await Promise.all(insert.newWallets.map(insertNewWallet));
		}
		await knex.schema.dropTable('wallets_old');
	} catch (error) {
		console.error(error);
	}
};

exports.down = async (knex, Promise) => {};
