'use strict';

const electron = require('electron');
const path = require('path');
const config = require('../config');
const request = require('request');
const async = require('async');

module.exports = function (app) {

    const loadCmcData = () => {
        request.get(config.cmcUrl, (error, httpResponse, result) => {
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
                    electron.app.sqlLiteService.TokenPrice.findBySymbol(item.symbol).then(symbol => {
                        if (symbol) {
                            if (item.priceUSD !== symbol.priceUSD || item.priceBTC !== symbol.priceBTC || item.priceETH !== symbol.priceETH) {
                                symbol.priceUSD = item.priceUSD;
                                symbol.priceBTC = item.priceBTC;
                                symbol.priceETH = item.priceETH;
                                electron.app.sqlLiteService.TokenPrice.edit(symbol).then(updateData => {
                                    callback();
                                }).catch(err => {
                                    callback();
                                });
                            }
                        } else {
                            electron.app.sqlLiteService.TokenPrice.add(item).then(insertData => {
                                callback();
                            }).catch(err => {
                                callback();
                            });
                        }
                    }).catch(err => {
                        callback();
                    });
                }, function (err) {
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

    return controller;
};
