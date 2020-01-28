/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('certifier_processes', t => {
			t.increments('id');
			t.string('processId');
			t.string('certifierId');
			t.string('userId');
			t.string('processType');
			t.string('processStatus')
				.notNullable()
				.defaultTo('open');
			t.string('kycStatus')
				.notNullable()
				.defaultTo('inProgress');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
		});

		await knex.schema.createTable('blockchain_claims', t => {
			t.increments('id');
			t.string('processId');
			t.string('certifierId');
			t.string('userId');
			t.string('claimHash');
			t.string('claimType');
			t.string('claimStatus');
			t.string('key');
			t.string('value');
			t.string('expires');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
		});

		await knex.schema.createTable('claim_documents', t => {
			t.increments('id');
			t.string('schema');
			t.text('data')
				.notNullable()
				.defaultTo('{}');
			t.text('privacy')
				.notNullable()
				.defaultTo('{}');
			t.text('signature')
				.notNullable()
				.defaultTo('{}');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
		});

		await knex.schema.createTable('questions', t => {
			t.increments('id');
			t.string('processId');
			t.string('question');
			t.string('type');
			t.string('status');
			t.string('answer');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
		});

		await knex.schema.createTable('messages', t => {
			t.increments('id');
			t.string('processId');
			t.string('sender');
			t.string('reciever');
			t.text('message');
			t.string('status');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
		});

		await knex.schema.createTable('calls', t => {
			t.increments('id');
			t.string('processId');
			t.string('time');
			t.string('type');
			t.string('status');
			t.string('contactType');
			t.string('contactDetails');
			t.text('notes');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('certifier_processes');
	await knex.schema.dropTable('blockchain_claims');
	await knex.schema.dropTable('claim_documents');
	await knex.schema.dropTable('questions');
	await knex.schema.dropTable('messages');
	await knex.schema.dropTable('calls');
};
