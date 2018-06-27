const { knex, sqlUtil } = require('../../services/knex');
const electron = require('electron');
const TABLE_NAME = 'token_prices';

const controller = {
	all: () => knex(TABLE_NAME).select(),

	findBySymbol: symbol =>
		knex(TABLE_NAME)
			.select()
			.where({ symbol })
			.then(rows => (rows && rows.length ? rows[0] : null)),

	add: tokenPrice => knex(TABLE_NAME).insert(tokenPrice),

	edit: tokenPrice =>
		knex(TABLE_NAME)
			.where('id', tokenPrice.id)
			.update(tokenPrice),

	bulkEdit: tokenPrices => Promise.all(tokenPrices.map(controller.edit)),

	bulkAdd: tokenPrices => sqlUtil.bulkAdd(TABLE_NAME, tokenPrices)
};

module.exports = controller;
