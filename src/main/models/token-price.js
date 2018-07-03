const { knex, sqlUtil } = require('../services/knex');
const TABLE_NAME = 'token_prices';

module.exports = {
	TABLE_NAME,
	findAll: tx => sqlUtil.select(TABLE_NAME, '*', null, tx),

	findBySymbol: (symbol, tx) => sqlUtil.selectOne(TABLE_NAME, '*', { symbol }, tx),

	create: (tokenPrice, tx) => sqlUtil.insert(TABLE_NAME, tokenPrice, tx),

	updateById: (id, tokenPrice, tx) => sqlUtil.updateById(TABLE_NAME, id, tokenPrice, tx),

	bulkEdit: tokenPrices => sqlUtil.bulkUpdateById(TABLE_NAME, tokenPrices),

	bulkAdd: tokenPrices => sqlUtil.bulkAdd(TABLE_NAME, tokenPrices)
};
