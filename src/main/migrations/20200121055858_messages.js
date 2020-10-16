/* istanbul ignore file */

exports.up = async (knex, Promise) => {
	try {
		await knex.schema.alterTable('kyc_applications', t => {
			t.string('messages')
				.notNullable()
				.defaultTo('[]');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = function(knex, Promise) {};
