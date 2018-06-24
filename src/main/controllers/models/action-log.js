const electron = require('electron');
const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'action_logs';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

	/**
	 *
	 */
	Controller.add = _add;
	Controller.findByWalletId = _findByWalletId;

	/**
	 *
	 */
	function _init() {
		return new Promise((resolve, reject) => {
			knex.schema.hasTable(TABLE_NAME).then(function(exists) {
				if (!exists) {
					knex.schema
						.createTable(TABLE_NAME, table => {
							table.increments('id');
							table
								.integer('walletId')
								.notNullable()
								.references('wallets.id');
							table.string('title');
							table.string('content');
							table.integer('createdAt').notNullable();
							table.integer('updatedAt');
						})
						.then(resp => {
							resolve('Table: ' + TABLE_NAME + ' created.');
						})
						.catch(error => {
							reject(error);
						});
				} else {
					resolve();
				}
			});
		});
	}

	function _add(item) {
		item.createdAt = new Date().getTime();
		return sqlLiteService.insert(TABLE_NAME, item);
	}

	function _findByWalletId(walletId) {
		return sqlLiteService.select(TABLE_NAME, '*', { walletId: walletId });
	}

	return Controller;
};
