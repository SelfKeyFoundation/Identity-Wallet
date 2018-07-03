const { knex, sqlUtil } = require('../../services/knex');

const TABLE_NAME = 'countries';

module.exports = {
	TABLE_NAME,
	findAll: tx => sqlUtil.select(TABLE_NAME, '*', null, tx)
};
