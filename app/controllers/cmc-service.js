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
                        symbol: item.symbol,
                        source: 'https://coinmarketcap.com',
                        priceUSD: +item.price_usd,
                        priceBTC: +item.price_btc,
                        priceETH: +item.price_eth,
                        createdAt: nowDate.getTime()
                    }
                });
                async.each(dataToInsert, function (item, callback) {
                    electron.app.sqlLiteService.tokenPrices_selectBySymbol(item.symbol).then(rows => {
                        const currResult = rows && rows.length ? rows[0] : null;
                        if (currResult) {
                            if (item.priceUSD !== currResult.priceUSD || item.priceBTC !== currResult.priceBTC || item.priceETH !== currResult.priceETH) {
                                currResult.priceUSD = item.priceUSD;
                                currResult.priceBTC = item.priceBTC;
                                currResult.priceETH = item.priceETH;
                                electron.app.sqlLiteService.tokenPrices_update(currResult).then(updateData => {
                                    callback();
                                }).catch(err => {
                                    callback();
                                });
                            }
                        } else {
                            electron.app.sqlLiteService.tokenPrices_insert(item).then(insertData => {
                                callback();
                            }).catch(err => {
                                callback();
                            });
                        }
                    }).catch(err => {
                        console.log(err);
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

    controller.prototype.getIcon = (symbol) => {

    }

    return controller;
};
