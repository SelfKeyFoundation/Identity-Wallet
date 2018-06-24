const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'transactions_history';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

	/**
	 *
	 */
	Controller.findAll = _findAll;
	Controller.findByWalletId = _findByWalletId;
	Controller.findByWalletIdAndTokenId = _findByWalletIdAndTokenId;

	function _findAll() {
		return new Promise((resolve, reject) => {
			knex(TABLE_NAME)
				.then(rows => {
					resolve(rows);
				})
				.catch(error => {
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	}

	function _findByWalletId(walletId) {
		return new Promise((resolve, reject) => {
			knex(TABLE_NAME)
				.where({ walletId: walletId })
				.then(rows => {
					resolve(rows);
				})
				.catch(error => {
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	}

	function _findByWalletIdAndTokenId(walletId, tokenId) {
		return new Promise((resolve, reject) => {
			knex(TABLE_NAME)
				.where({ walletId: walletId, tokenId: tokenId })
				.then(rows => {
					resolve(rows);
				})
				.catch(error => {
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	}

	return Controller;
};
