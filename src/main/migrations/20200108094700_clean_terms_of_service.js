exports.up = async knex => {
	await knex('vendors').update({ termsOfService: '' });
};

exports.down = async knex => {};
