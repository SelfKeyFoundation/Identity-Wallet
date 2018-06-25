const { knex } = require('../../services/knex');

const TABLE_NAME = 'documents';

module.exports = () => ({
	findById: id =>
		knex(TABLE_NAME)
			.where({ id })
			.select()
			.then(rows => rows.pop())
});
