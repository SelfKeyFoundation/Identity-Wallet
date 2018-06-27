'use strict';

const Promise = require('bluebird');

const { knex, sqlUtil } = require('../services/knex');

module.exports = function(app) {
	const controller = function() {};

	/**
	 * common methods
	 */
	controller.knex = knex;

	controller.insertIntoTable = sqlUtil.insertIntoTable;
	controller.select = sqlUtil.select;
	controller.insert = sqlUtil.insert;
	controller.insertAndSelect = sqlUtil.insertAndSelect;
	controller.update = sqlUtil.update;
	controller.updateById = sqlUtil.updateById;
	controller.bulkUpdateById = sqlUtil.bulkUpdateById;
	controller.bulkAdd = sqlUtil.bulkAdd;

	let Wallet = require('./models/wallet.js')(app, controller);
	controller.prototype.Wallet = Wallet;

	let AppSetting = require('./models/app-setting.js')(app, controller);
	controller.prototype.AppSetting = AppSetting;

	let WalletSetting = require('./models/wallet-setting.js')(app, controller);
	controller.prototype.WalletSetting = WalletSetting;

	let Country = require('./models/country.js')(app, controller);
	controller.prototype.Country = Country;

	let Document = require('./models/document.js')(app, controller);
	controller.prototype.Document = Document;

	let IdAttributeType = require('./models/id-attribute-type.js')(app, controller);
	controller.prototype.IdAttributeType = IdAttributeType;

	let IdAttribute = require('./models/id-attribute.js')(app, controller);
	controller.prototype.IdAttribute = IdAttribute;

	let Token = require('./models/token.js')(app, controller);
	controller.prototype.Token = Token;

	let GuideSetting = require('./models/guide-setting.js')(app, controller);
	controller.prototype.GuideSetting = GuideSetting;

	let ActionLog = require('./models/action-log.js')(app, controller);
	controller.prototype.ActionLog = ActionLog;

	let ExchangeDataHandler = require('./models/exchange.js')(app, controller);
	controller.prototype.ExchangeDataHandler = ExchangeDataHandler;

	let TokenPrice = require('./models/token-price.js');
	controller.prototype.TokenPrice = TokenPrice;

	let TxHistory = require('./models/tx-history.js')(app, controller);
	controller.prototype.TxHistory = TxHistory;

	// TODO
	controller.prototype.wallet_new_token_insert = (data, balance, walletId) => {
		data.createdAt = new Date().getTime();
		return new Promise((resolve, reject) => {
			return knex
				.transaction(trx => {
					knex('tokens')
						.transacting(trx)
						.insert(data)
						.then(resp => {
							let id = resp[0];
							// add wallet tokens
							return sqlUtil.insertIntoTable(
								'wallet_tokens',
								{
									walletId: walletId,
									tokenId: id,
									balance: balance,
									recordState: 1,
									createdAt: new Date().getTime()
								},
								trx
							);
						})
						.then(trx.commit)
						.catch(trx.rollback);
				})
				.then(rowData => {
					walletTokens_selectById(rowData.id)
						.then(walletData => {
							return resolve(walletData);
						})
						.catch(err => {
							return reject(err);
						});
				})
				.catch(err => {
					return reject(err);
				});
		});
	};

	/**
	 * wallet_tokens
	 */
	// TODO
	controller.prototype.walletTokens_selectByWalletId = walletId => {
		return new Promise((resolve, reject) => {
			let promise = knex('wallet_tokens')
				.select(
					'wallet_tokens.*',
					'token_prices.name',
					'token_prices.priceUSD',
					'tokens.symbol',
					'tokens.decimal',
					'tokens.address',
					'tokens.isCustom'
				)
				.leftJoin('tokens', 'tokenId', 'tokens.id')
				.leftJoin('token_prices', 'tokens.symbol', 'token_prices.symbol')
				.where({ walletId: walletId, recordState: 1 });

			promise
				.then(rows => {
					return resolve(rows);
				})
				.catch(error => {
					// eslint-disable-next-line prefer-promise-reject-errors
					return reject({ message: 'error_while_selecting', error: error });
				});
		});
	};

	// eslint-disable-next-line camelcase
	function walletTokens_selectById(id) {
		return new Promise((resolve, reject) => {
			let promise = knex('wallet_tokens')
				.select(
					'wallet_tokens.*',
					'token_prices.name',
					'token_prices.priceUSD',
					'tokens.symbol',
					'tokens.decimal',
					'tokens.address',
					'tokens.isCustom'
				)
				.leftJoin('tokens', 'tokenId', 'tokens.id')
				.leftJoin('token_prices', 'tokens.symbol', 'token_prices.symbol')
				.where({ 'wallet_tokens.id': id, recordState: 1 });

			promise
				.then(rows => {
					rows && rows.length ? resolve(rows[0]) : resolve(null);
				})
				.catch(error => {
					console.log(error);
					// eslint-disable-next-line prefer-promise-reject-errors
					return reject({ message: 'error_while_selecting', error: error });
				});
		});
	}

	// eslint-disable-next-line camelcase
	controller.prototype.walletTokens_selectById = walletTokens_selectById;

	// TODO
	controller.prototype.wallet_tokens_insert = data => {
		data.recordState = 1;

		return new Promise((resolve, reject) => {
			sqlUtil
				.insertIntoTable('wallet_tokens', data)
				.then(rowData => {
					walletTokens_selectById(rowData.id)
						.then(walletData => {
							return resolve(walletData);
						})
						.catch(err => {
							return reject(err);
						});
				})
				.catch(err => {
					return reject(err);
				});
		});
	};

	// TODO
	controller.prototype.wallet_tokens_update = data => {
		return sqlUtil.updateById('wallet_tokens', data);
	};

	/**
	 * tokens
	 */
	controller.prototype.tokens_selectBySymbol = symbol => {
		return sqlUtil.select('tokens', { symbol: 'eth' });
	};

	controller.prototype.token_insert = data => {
		return sqlUtil.insertIntoTable('tokens', data);
	};

	controller.prototype.token_update = data => {
		return sqlUtil.updateById('tokens', data);
	};

	controller.prototype.transactionsHistory_insert = data => {
		return sqlUtil.insertIntoTable('transactions_history', data);
	};

	return controller;
};
