/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex('token_prices').truncate();
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {};
