exports.up = async knex => {
	try {
		await knex.schema.createTable('marketplace_orders', t => {
			t.increments('id');
			t.string('vendorId');
			t.string('amount');
			t.string('itemId');
			t.string('productInfo');
			t.string('vendorName');
			t.integer('walletId');
			t.string('applicationId');
			t.string('did');
			t.string('vendorDID');
			t.string('allowanceHash');
			t.string('paymentHash');
			t.string('status');
			t.string('statusMessage');
			t.string('affiliate1DID');
			t.string('affiliate2DID');
			t.string('env');
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async knex => {
	await knex.schema.dropTable('marketplace_orders');
};
