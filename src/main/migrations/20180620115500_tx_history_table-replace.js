/* istanbul ignore file */
/**
 * old transactions_history table is removed
 * tx_history is added with new collumns
 * old last synced block's fields are removed
 * new last block synced field is added on wallet_settings
 */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('tx_history', table => {
			table.increments('id');
			table
				.string('hash')
				.unique()
				.notNullable();
			table.integer('blockNumber');
			table.integer('timeStamp').notNullable();
			table.integer('nonce');
			table.string('blockHash');
			table.string('contractAddress');
			table.string('from').notNullable();
			table.string('to').notNullable();
			table.integer('value').notNullable();
			table.string('tokenName');
			table.string('tokenSymbol');
			table.integer('tokenDecimal');
			table.integer('transactionIndex');
			table.integer('gas');
			table.integer('gasPrice').notNullable();
			table.integer('cumulativeGasUsed');
			table.integer('gasUsed');
			table.string('input');
			table.integer('confirmations');
			table.integer('isError');
			table.integer('txReceiptStatus');
			table.integer('networkId').notNullable();
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		});

		await knex.schema.dropTable('transactions_history');

		await knex.schema.table('wallet_settings', function(t) {
			t.integer('txHistoryLastSyncedBlock')
				.notNull()
				.defaultTo(0);
		});

		await knex.schema.table('wallet_settings', t => {
			t.dropColumn('ERC20TxHistoryLastBlock');
			t.dropColumn('EthTxHistoryLastBlock');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('tx_history');

	await knex.schema.table('wallet_settings', t => {
		t.dropColumn('txHistoryLastSyncedBlock');
		t.integer('ERC20TxHistoryLastBlock');
		t.integer('EthTxHistoryLastBlock');
	});
	await knex.schema.createTable('transactions_history', table => {
		table.increments('id');
		table
			.integer('walletId')
			.notNullable()
			.references('wallets.id');
		table.integer('tokenId').references('tokens.id');
		table
			.string('txId')
			.unique()
			.notNullable();
		table.string('sentTo');
		table.decimal('value', null).notNullable();
		table.integer('timestamp').notNullable();
		table.integer('blockNumber').notNullable();
		table.decimal('gas').notNullable();
		table.string('gasPrice').notNullable();
		table.integer('createdAt').notNullable();
		table.integer('updatedAt');
	});
};
