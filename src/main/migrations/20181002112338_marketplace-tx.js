/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('marketplace-transactions', t => {
			t.increments('id');
			t.string('serviceOwner').notNullable();
			t.string('serviceId').notNullable();
			t.string('action').notNullable();
			t.float('amount');
			t.float('gasPrice');
			t.float('gasLimit');
			t.integer('networkId');
			t.string('blockchainTx');
			t.string('lastStatus');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('marketplace-transactions');
};
