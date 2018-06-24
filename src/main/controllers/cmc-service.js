'use strict';

const electron = require('electron');
const log = require('electron-log');
const config = require('../config');
const request = require('request');
const async = require('async');
const EventEmitter = require('events');

module.exports = function(app) {
	const eventEmitter = new EventEmitter();

	const loadCmcData = () => {
		return request.get(config.cmcUrl, (error, httpResponse, result) => {
			let data = [];
			try {
				data = JSON.parse(result);
			} catch (error) {
				log.error(error);
			}
			if (data.length) {
				const nowDate = new Date();
				let dataToInsert = data.map(item => {
					return {
						name: item.name,
						symbol: item.symbol,
						source: 'https://coinmarketcap.com',
						priceUSD: +item.price_usd,
						priceBTC: +item.price_btc,
						priceETH: +item.price_eth,
						createdAt: nowDate.getTime()
					};
				});
				const symbolsToUpdate = [];
				const symbolsToAdd = [];
				async.each(
					dataToInsert,
					function(item, callback) {
						return electron.app.sqlLiteService.TokenPrice.findBySymbol(item.symbol)
							.then(symbol => {
								if (symbol) {
									if (
										item.priceUSD !== symbol.priceUSD ||
										item.priceBTC !== symbol.priceBTC ||
										item.priceETH !== symbol.priceETH
									) {
										symbol.priceUSD = item.priceUSD;
										symbol.priceBTC = item.priceBTC;
										symbol.priceETH = item.priceETH;
										symbolsToUpdate.push(symbol);
									}
									return callback(null);
								} else {
									symbolsToAdd.push(item);
									return callback(null);
								}
							})
							.catch(err => {
								return callback(err);
							});
					},
					function(err) {
						if (err) {
							log.error('TOKEN PRICE SELECT', err);
						}

						electron.app.sqlLiteService.TokenPrice.bulkAdd(symbolsToAdd)
							.then(() => {
								electron.app.sqlLiteService.TokenPrice.bulkEdit(
									symbolsToUpdate
								).catch(err => {
									log.error('TOKEN PRICE UPDATE', err);
								});
							})
							.catch(err => {
								log.error('TOKEN PRICE ADD', err);
							});

						eventEmitter.emit('UPDATE');
					}
				);
			}
		});
	};

	const controller = function() {};

	controller.prototype.startUpdateData = () => {
		loadCmcData();
		setInterval(loadCmcData, config.cmcUpdatePeriod);
	};

	controller.prototype.eventEmitter = eventEmitter;

	return controller;
};
