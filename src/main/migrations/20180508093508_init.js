exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('action_logs', table => {
			table.increments('id');
			table
				.integer('walletId')
				.notNullable()
				.references('wallets.id');
			table.string('title');
			table.string('content');
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('app_settings', table => {
			table.increments('id');
			table.string('dataFolderPath').notNullable();
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('countries', table => {
			table.increments('id');
			table
				.string('name')
				.unique()
				.notNullable();
			table
				.string('code')
				.unique()
				.notNullable();
			table.string('dialCode').notNullable();
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('documents', table => {
			table.increments('id');
			table.string('name').notNullable();
			table.string('mimeType').notNullable();
			table.integer('size').notNullable();
			table.binary('buffer').notNullable();
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('exchange_data', table => {
			table.string('name').primary();
			table.string('data').notNullable();
			table
				.integer('createdAt')
				.notNullable()
				.defaultTo(new Date().getTime());
			table.integer('updatedAt');
		}),

		knex.schema.createTable('guide_settings', table => {
			table.increments('id');
			table.integer('guideShown').defaultTo(0);
			table.integer('icoAdsShown').defaultTo(0);
			table.integer('termsAccepted').defaultTo(0);
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('id_attribute_types', table => {
			table.string('key').primary();
			table.string('category').notNullable();
			table.string('type').notNullable();
			table.string('entity').notNullable();
			table.integer('isInitial').defaultTo(0);
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('id_attributes', table => {
			table.increments('id');
			table
				.integer('walletId')
				.notNullable()
				.references('wallets.id');
			table
				.integer('idAttributeType')
				.notNullable()
				.references('id_attribute_types.key');
			table
				.text('items')
				.notNullable()
				.defaultTo('{}');
			table.integer('order').defaultTo(0);
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
			table.unique(['walletId', 'idAttributeType']);
		}),

		knex.schema.createTable('seed', table => {
			table.increments('id');
			table.integer('init');
		}),

		knex.schema.createTable('token_prices', table => {
			table.increments('id');
			table.string('name').notNullable();
			table.string('symbol').notNullable();
			table.string('source');
			table.decimal('priceUSD');
			table.decimal('priceBTC');
			table.decimal('priceETH');
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('tokens', table => {
			table.increments('id');
			table
				.string('symbol')
				.unique()
				.notNullable();
			table.integer('decimal').notNullable();
			table.string('address').notNullable();
			table.binary('icon');
			table
				.integer('isCustom')
				.notNullable()
				.defaultTo(0);
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('transactions_history', table => {
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
		}),

		knex.schema.createTable('wallet_settings', table => {
			table.increments('id');
			table
				.integer('walletId')
				.notNullable()
				.references('wallets.id');
			table
				.integer('sowDesktopNotifications')
				.notNullable()
				.defaultTo(0);
			table.integer('ERC20TxHistoryLastBlock');
			table.integer('EthTxHistoryLastBlock');
			table.string('airDropCode');
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('wallets', table => {
			table.increments('id');
			table.string('name');
			table
				.string('publicKey')
				.unique()
				.notNullable();
			table.string('privateKey');
			table.string('keystoreFilePath');
			table.binary('profilePicture');
			table
				.integer('isSetupFinished')
				.notNullable()
				.defaultTo(0);
			table
				.string('profile')
				.notNullable()
				.defaultTo('local');
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		}),

		knex.schema.createTable('wallet_tokens', table => {
			table.increments('id');
			table
				.integer('walletId')
				.notNullable()
				.references('wallets.id');
			table
				.integer('tokenId')
				.notNullable()
				.references('tokens.id');
			table.decimal('balance').defaultTo(0);
			table.integer('hidden').defaultTo(0);
			table.integer('recordState').defaultTo(1);
			table
				.integer('createdAt')
				.notNullable()
				.defaultTo(new Date().getTime());
			table.integer('updatedAt');
		})
	]);
};

exports.down = function(knex, Promise) {};
