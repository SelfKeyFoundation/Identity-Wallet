exports.up = async knex => {
	try {
		await knex.schema.table('kyc_applications', t => {
			t.string('templateId');
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async knex => {};
