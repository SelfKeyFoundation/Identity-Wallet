'use strict';

const Promise = require('bluebird');

module.exports = function (app) {

    const controller = function () { };

    const knexFile = require('../knexfile.js')
    const knex = require('knex')(knexFile)
    
    /**
     * Migrations
     */    
    async function initDB() {
        try {
            await knex.migrate.latest()
            await knex.seed.run()
        } catch (e) {
            console.log(e)
        }
    }

    initDB()

    /**
     * common methods
     */
    controller.knex = knex;

    controller.insertIntoTable = insertIntoTable;
    controller.select = _select;
    controller.insert = _insert;
    controller.insertAndSelect = _insertAndSelect;
    controller.update = _update;
    controller.updateById = updateById;

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

    let TokenPrice = require('./models/token-price.js')(app, controller);
    controller.prototype.TokenPrice = TokenPrice;

    let TransactionHistory = require('./models/transaction-history.js')(app, controller);
    controller.prototype.TransactionHistory = TransactionHistory;


    // TODO
    controller.prototype.wallet_new_token_insert = (data, balance, walletId) => {
        data.createdAt = new Date().getTime();
        return new Promise((resolve, reject) => {

            return knex.transaction((trx) => {
                knex('tokens')
                    .transacting(trx)
                    .insert(data)
                    .then((resp) => {
                        let id = resp[0];
                        // add wallet tokens
                        return insertIntoTable('wallet_tokens', { walletId: walletId, tokenId: id, balance: balance, recordState: 1, createdAt: new Date().getTime() }, trx);
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);
            }).then((rowData) => {
                walletTokens_selectById(rowData.id).then((walletData) => {
                    return resolve(walletData);
                }).catch((err) => {
                    return reject(err);
                });
            }).catch((err) => {
                return reject(err);
            });
        });
    }

    /**
     * wallet_tokens
     */
    // TODO
    controller.prototype.walletTokens_selectByWalletId = (walletId) => {
        return new Promise((resolve, reject) => {
            let promise = knex('wallet_tokens')
                .select('wallet_tokens.*', 'token_prices.name', 'token_prices.priceUSD', 'tokens.symbol', 'tokens.decimal', 'tokens.address', 'tokens.isCustom')
                .leftJoin('tokens', 'tokenId', 'tokens.id')
                .leftJoin('token_prices', 'tokens.symbol', 'token_prices.symbol')
                .where({ walletId: walletId, recordState: 1 });

            promise.then((rows) => {
                return resolve(rows);
            }).catch((error) => {
                return reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    // TODO
    function walletTokens_selectById(id) {
        return new Promise((resolve, reject) => {
            let promise = knex('wallet_tokens')
                .select('wallet_tokens.*', 'token_prices.name', 'token_prices.priceUSD', 'tokens.symbol', 'tokens.decimal', 'tokens.address', 'tokens.isCustom')
                .leftJoin('tokens', 'tokenId', 'tokens.id')
                .leftJoin('token_prices', 'tokens.symbol', 'token_prices.symbol')
                .where({ 'wallet_tokens.id': id, recordState: 1 });

            promise.then((rows) => {
                rows && rows.length ? resolve(rows[0]) : resolve(null);
            }).catch((error) => {
                console.log(error);
                return reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    // TODO
    controller.prototype.walletTokens_selectById = walletTokens_selectById;

    // TODO
    controller.prototype.wallet_tokens_insert = (data) => {
        data.recordState = 1;

        return new Promise((resolve, reject) => {
            insertIntoTable('wallet_tokens', data).then((rowData) => {
                walletTokens_selectById(rowData.id).then((walletData) => {
                    return resolve(walletData);
                }).catch((err) => {
                    return reject(err);
                });
            }).catch((err) => {
                return reject(err);
            });
        });
    }

    // TODO
    controller.prototype.wallet_tokens_update = (data) => {
        return updateById('wallet_tokens', data);
    }

    /**
     * tokens
     */
    controller.prototype.tokens_selectBySymbol = (symbol) => {
        return selectTable('tokens', { symbol: 'eth' });
    }

    controller.prototype.token_insert = (data) => {
        return insertIntoTable('tokens', data);
    }

    controller.prototype.token_update = (data) => {
        return updateById('tokens', data);
    }

    controller.prototype.transactionsHistory_insert = (data) => {
        return insertIntoTable('transactions_history', data);
    }

    /**
     * commons
     */
    function _select(table, select, where, tx) {
        let query = knex(table);

        if (tx) {
            query = query.transacting(tx);
        }

        query = query.select(select);

        if (where) {
            query = query.where(where);
        }

        return query;
    }

    function _insert(table, args, tx) {
        let query = knex(table);

        if (tx) {
            query = query.transacting(tx);
        }

        return query.insert(args);
    }

    function _insertAndSelect(table, data, trx) {
        return new Promise((resolve, reject) => {
            let promise = null;

            if (!trx) {
                promise = knex(table).insert(data);
            } else {
                promise = knex(table).transacting(trx).insert(data);
            }

            return promise.then((resp) => {
                if (!resp || resp.length !== 1) {
                    return reject({ message: "error_while_creating" });
                }

                let selectPromise = null;

                if (trx) {
                    selectPromise = knex(table).transacting(trx).select().where('id', resp[0])
                } else {
                    selectPromise = knex(table).select().where('id', resp[0])
                }

                selectPromise.then((rows) => {
                    if (rows && rows.length === 1) {
                        return resolve(rows[0]);
                    } else {
                        return reject({ message: "error_while_creating" });
                    }
                }).catch((error) => {
                    return reject({ message: "error_while_creating", error: error });
                });
            }).catch((error) => {
                return reject({ message: "error_while_creating", error: error });
            })
        });
    }

    function _update (table, item, where, tx) {
        let query = knex(table);

        if (tx) {
            query = query.transacting(tx);
        }

        if (where) {
            query = query.where(where);
        }

        return query.update(item);
    }

    function insertIntoTable(table, data, trx) {
        return new Promise((resolve, reject) => {
            let promise = null;
            if (!trx) {
                promise = knex(table).insert(data);
            } else {
                promise = knex(table).transacting(trx).insert(data);
            }

            return promise.then((resp) => {
                if (!resp || resp.length !== 1) {
                    return reject({ message: "error_while_creating" });
                }

                let selectPromise = null;

                if (trx) {
                    selectPromise = knex(table).transacting(trx).select().where('id', resp[0])
                } else {
                    selectPromise = knex(table).select().where('id', resp[0])
                }

                selectPromise.then((rows) => {
                    if (rows && rows.length === 1) {
                        return resolve(rows[0]);
                    } else {
                        return reject({ message: "error_while_creating" });
                    }
                }).catch((error) => {
                    return reject({ message: "error_while_creating", error: error });
                });
            }).catch((error) => {
                return reject({ message: "error_while_creating", error: error });
            })
        });
    }

    function updateById(table, data) {
        return new Promise((resolve, reject) => {
            data.updatedAt = new Date().getTime();
            return knex(table).update(data).where({'id': data.id}).then((updatedIds) => {
                if (!updatedIds || updatedIds != 1) {
                    return reject({ message: "error_while_updating" });
                }

                return knex(table).select().where({'id': data.id}).then((rows) => {
                    if (rows && rows.length == 1) {
                        return resolve(rows[0]);
                    } else {
                        return reject({ message: "error_while_updating" });
                    }
                }).catch(error => {
                    return reject({ message: "error_while_updating", error: error });
                });
            }).catch((error) => {
                return reject({ message: "error_while_updating", error: error });
            })
        });
    }

    // TODO remove
    function getById(table, id) {
        return selectById(table, id);
    }

    function selectById(table, id) {
        return new Promise((resolve, reject) => {
            return knex(table).select().where('id', id).then((rows) => {
                rows && rows.length ? resolve(rows[0]) : resolve(null);
            }).catch((error) => {
                return reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    // TODO rename to select
    function selectTable(table, where, tx) {
        return select(table, where, tx);
    }

    function select(table, where, tx) {
        return new Promise((resolve, reject) => {
            let promise = null;
            if (tx) {
                promise = knex(table).transacting(tx).select().where(where);
            } else {
                promise = knex(table).select().where(where);
            }

            return promise.then((rows) => {
                return resolve(rows);
            }).catch((error) => {
                return reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    return controller;
};
