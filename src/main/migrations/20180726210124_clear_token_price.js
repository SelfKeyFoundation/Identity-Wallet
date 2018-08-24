/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex('token_prices').truncate();
};

exports.down = async (knex, Promise) => {};
