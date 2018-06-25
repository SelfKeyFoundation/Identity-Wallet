const { knex } = require('../../services/knex');

const TABLE_NAME = 'countries';

module.exports = () => ({
	findAll: () => knex(TABLE_NAME).select()
});
