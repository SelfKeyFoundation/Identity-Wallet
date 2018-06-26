const { knex } = require('../../services/knex');

const TABLE_NAME = 'guide_settings';

module.exports = () => ({
	findAll: () => knex(TABLE_NAME).select(),
	updateById: (id, data) =>
		knex(TABLE_NAME)
			.where({ id })
			.update(data)
});
