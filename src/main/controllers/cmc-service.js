'use strict';

const electron = require('electron');
const path = require('path');
const config = require('../config');
const request = require('request');
const async = require('async');
const EventEmitter = require('events');


module.exports = function (app) {
    const eventEmitter = new EventEmitter();


    const loadCmcData = () => {
        return request.get(config.cmcUrl, (error, httpResponse, result) => {

            let data = [];
            try {
                data = JSON.parse(result);
            } catch (error) {
                console.log(error);
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
                    }
                });
                async.each(dataToInsert, function (item, callback) {
                    return electron.app.sqlLiteService.TokenPrice.findBySymbol(item.symbol).then(symbol => {
                        if (symbol) {
                            if (item.priceUSD !== symbol.priceUSD || item.priceBTC !== symbol.priceBTC || item.priceETH !== symbol.priceETH) {
                                symbol.priceUSD = item.priceUSD;
                                symbol.priceBTC = item.priceBTC;
                                symbol.priceETH = item.priceETH;
                               return electron.app.sqlLiteService.TokenPrice.edit(symbol).then(updateData => {
                                    return callback(null);
                                }).catch(err => {
                                    return callback(err);
                                });
                            } else {
                                return callback(null);
                            }
                        } else {
                           return electron.app.sqlLiteService.TokenPrice.add(item).then(insertData => {
                                return callback(null);
                            }).catch(err => {
                                return callback(err);
                            });
                        }
                    }).catch(err => {
                        return callback(err);
                    });
                }, function (err) {
                    eventEmitter.emit('UPDATE');
                    setTimeout(loadCmcData, config.cmcUpdatePeriod);
                });

            } else {
                setTimeout(loadCmcData, config.cmcUpdatePeriod);
            }
        });
    }

    const controller = function () { };

    controller.prototype.startUpdateData = () => {
        setTimeout(loadCmcData, 1000);
    }

    controller.prototype.eventEmitter = eventEmitter;

    return controller;
};