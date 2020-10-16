exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('contract_allowance', t => {
			t.increments('id');
			t.integer('walletId')
				.notNullable()
				.references('wallets.id');
			t.string('contractAddress');
			t.string('tokenAddress');
			t.string('allowanceAmount');
			t.string('env');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
			t.unique(['walletId', 'contractAddress', 'tokenAddress', 'env']);
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('contract_allowance');
};
