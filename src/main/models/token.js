const { knex, sqlUtil } = require('../../services/knex');

const TABLE_NAME = 'tokens';

module.exports = {
	TABLE_NAME,
	findAll: tx => sqlUtil.select(TABLE_NAME, '*', tx),
	findBySymbol: (symbol, tx) => sqlUtil.select(TABLE_NAME, { symbol }, tx),
	create: (data, tx) => sqlUtil.insertAndSelect(TABLE_NAME, data, tx),
	update: (data, tx) => sqlUtil.updateById(TABLE_NAME, data.id, data)
};
