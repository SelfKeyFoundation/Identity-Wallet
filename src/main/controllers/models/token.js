const { knex } = require('../../services/knex');

const TABLE_NAME = 'tokens';

module.exports = () => ({
	findAll: () => knex(TABLE_NAME).select()
});
