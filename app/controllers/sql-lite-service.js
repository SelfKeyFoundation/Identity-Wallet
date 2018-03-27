'use strict';

const Promise = require('bluebird');
const electron = require('electron');
const path = require('path');

const countriesList = require('./../../assets/data/country-list.json');
const ethTokensList = require('./../../assets/data/eth-tokens.json');
const initialIdAttributeTypeList = require('./../../assets/data/initial-id-attribute-type-list.json');

module.exports = function (app) {

    const controller = function () { };

    const dbFilePath = path.join(app.config.userDataPath, 'IdentityWalletStorage.sqlite');
    const knex = require('knex')({
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: dbFilePath
        }
    });

    /**
     * common methods
     */
    controller.knex = knex;

    controller.insertIntoTable = insertIntoTable;
    controller.select = _select;
    controller.insert = _insert;
    controller.update = _update;

    let Wallet = require('./models/wallet.js')(app, controller);
    controller.prototype.Wallet = Wallet;

    let AppSetting = require('./models/app-setting.js')(app, controller);
    controller.prototype.AppSetting = AppSetting;

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

    /**
     * tables
     */
    function createIdAttributeItems() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable('id_attribute_items').then(function (exists) {
                if (!exists) {
                    knex.schema.createTable('id_attribute_items', (table) => {
                        table.increments('id');
                        table.integer('idAttributeId').notNullable().references('id_attributes.id');
                        table.string('name');
                        table.integer('isVerified').notNullable().defaultTo(0);
                        table.integer('order').defaultTo(0);
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                    }).then((resp) => {
                        console.log("Table:", "id_attribute_items", "created.");
                        resolve("id_attribute_items created");
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    function createIdAttributeValues() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable('id_attribute_item_values').then(function (exists) {
                if (!exists) {
                    knex.schema.createTable('id_attribute_item_values', (table) => {
                        table.increments('id');
                        table.integer('idAttributeItemId').notNullable().references('id_attribute_items.id');
                        table.integer('documentId').references('documents.id');
                        table.string('staticData');
                        table.integer('order').defaultTo(0);
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                    }).then((resp) => {
                        console.log("Table:", "id_attribute_item_values", "created.");
                        resolve("id_attribute_item_values created");
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    function createTokenPrices() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable('token_prices').then(function (exists) {
                if (!exists) {
                    knex.schema.createTable('token_prices', (table) => {
                        table.increments('id');
                        table.string('name').notNullable();
                        table.string('symbol').notNullable().unique();
                        table.string('source');
                        table.decimal('priceUSD');
                        table.decimal('priceBTC');
                        table.decimal('priceETH');
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                    }).then((resp) => {
                        console.log("Table:", "token_prices", "created.");
                        resolve("token_prices created");
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    function createWalletTokens() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable('wallet_tokens').then(function (exists) {
                if (!exists) {
                    knex.schema.createTable('wallet_tokens', (table) => {
                        table.increments('id');
                        table.integer('walletId').notNullable().references('wallets.id');
                        table.integer('tokenId').notNullable().references('tokens.id');
                        table.decimal('balance').defaultTo(0);
                        table.integer('recordState').defaultTo(1);
                        table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                        table.integer('updatedAt');
                    }).then((resp) => {
                        console.log("Table:", "wallet_tokens", "created.");
                        resolve("wallet_tokens created");
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    function createTransactionsHistory() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable('transactions_history').then(function (exists) {
                if (!exists) {
                    knex.schema.createTable('transactions_history', (table) => {
                        table.increments('id');
                        table.integer('walletId').notNullable().references('wallets.id');
                        table.integer('tokenId').references('tokens.id');
                        table.string('txId').unique().notNullable();
                        table.string('sentTo');
                        table.decimal('value', null).notNullable();
                        table.integer('timestamp').notNullable();
                        table.integer('blockNumber').notNullable();
                        table.decimal('gas').notNullable();
                        table.string('gasPrice').notNullable();
                        table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                        table.integer('updatedAt');
                    }).then((resp) => {
                        console.log("Table:", "transactions_history", "created.");
                        resolve("transactions_history created");
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    function createWalletSettings() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable('wallet_settings').then(function (exists) {
                if (!exists) {
                    knex.schema.createTable('wallet_settings', (table) => {
                        table.increments('id');
                        table.integer('walletId').notNullable().references('wallets.id');
                        table.integer('sowDesktopNotifications').notNullable().defaultTo(0);
                        table.integer('ERC20TxHistoryLastBlock');
                        table.integer('EthTxHistoryLastBlock');
                        table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                        table.integer('updatedAt');
                    }).then((resp) => {
                        console.log("Table:", "wallet_settings", "created.");
                        resolve("wallet_settings created");
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * public methods
     */
    controller.prototype.init = () => {
        let promises = [];
        promises.push(Country.init());
        promises.push(Document.init());
        promises.push(IdAttributeType.init());
        promises.push(Token.init());
        promises.push(Wallet.init());
        promises.push(AppSetting.init());
        promises.push(GuideSetting.init());
        promises.push(IdAttribute.init());
        promises.push(createIdAttributeItems());
        promises.push(createIdAttributeValues());
        promises.push(createTokenPrices());
        promises.push(createWalletTokens());
        promises.push(createTransactionsHistory());
        promises.push(ActionLog.init());
        promises.push(createWalletSettings());
        promises.push(ExchangeDataHandler.init());
        return Promise.all(promises)
    }

    /**
     *
     */
    controller.prototype.wallet_new_token_insert = (data, balance, walletId) => {
        data.createdAt = new Date().getTime();
        return new Promise((resolve, reject) => {

            knex.transaction((trx) => {
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
                    resolve(walletData);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * wallets
     */
    /*
    controller.prototype.wallets_insert = (data, basicInfo) => {
        data.createdAt = new Date().getTime();
        return knex.transaction((trx) => {
            knex('wallets')
                .transacting(trx)
                .insert(data)
                .then((resp) => {
                    let id = resp[0];

                    let promises = [];

                    // add wallet settings
                    promises.push(insertIntoTable('wallet_settings', { walletId: id, sowDesktopNotifications: 1, createdAt: new Date().getTime() }, trx));

                    // add wallet tokens
                    promises.push(insertIntoTable('wallet_tokens', { walletId: id, tokenId: 1, createdAt: new Date().getTime() }, trx));

                    return new Promise((resolve, reject) => {
                        Promise.all(promises).then(() => {
                            let idAttributesSavePromises = [];
                            let idAttributeItemsSavePromises = [];
                            let idAttributeItemValuesSavePromises = [];

                            selectTable('id_attribute_types', { isInitial: 1 }, trx).then((idAttributeTypes) => {
                                for (let i in idAttributeTypes) {
                                    let idAttributeType = idAttributeTypes[i];

                                    // add initial id attributes
                                    idAttributesSavePromises.push(insertIntoTable('id_attributes', { walletId: id, idAttributeType: idAttributeType.key, createdAt: new Date().getTime() }, trx).then((idAttribute) => {
                                        idAttributeItemsSavePromises.push(insertIntoTable('id_attribute_items', { idAttributeId: idAttribute.id, isVerified: 0, createdAt: new Date().getTime() }).then((idAttributeItem) => {
                                            let staticData = JSON.stringify({ line1: basicInfo[idAttributeType.key] });
                                            idAttributeItemValuesSavePromises.push(insertIntoTable('id_attribute_item_values', { idAttributeItemId: idAttributeItem.id, staticData: staticData, createdAt: new Date().getTime() }));
                                        }));
                                    }));
                                }

                                let finalPromises = [];
                                finalPromises.push(Promise.all(idAttributesSavePromises));
                                finalPromises.push(Promise.all(idAttributeItemsSavePromises));
                                finalPromises.push(Promise.all(idAttributeItemValuesSavePromises));

                                Promise.each(finalPromises, (el) => { return el }).then(() => {
                                    data.id = id;
                                    resolve(data);
                                }).catch((error) => {
                                    reject({ message: "wallets_insert_error", error: error });
                                });

                            }).catch((error) => {
                                reject({ message: "wallets_insert_error", error: error });
                            });
                        }).catch((error) => {
                            reject({ message: "wallets_insert_error", error: error });
                        });
                    });
                })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }
    */

    controller.prototype.wallets_update = (data) => {
        return updateById('wallets', data);
    }

    controller.prototype.wallets_selectById = (id) => {
        return getById('wallets', id);
    }

    controller.prototype.walletSettings_selectByWalletId = (id) => {
        return selectTable('wallet_settings', { walletId: id });
    }

    controller.prototype.walletSettings_update = (data) => {
        return updateById('wallet_settings', data);
    }

    controller.prototype.wallets_selectAll = () => {
        return new Promise((resolve, reject) => {
            knex('wallets').select().then((rows) => {
                if (rows && rows.length) {
                    resolve(rows);
                } else {
                    resolve(null);
                }
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    /**
     * wallet_tokens
     */
    controller.prototype.walletTokens_selectByWalletId = (walletId) => {
        return new Promise((resolve, reject) => {
            let promise = knex('wallet_tokens')
                .select('wallet_tokens.*', 'token_prices.name', 'token_prices.priceUSD', 'tokens.symbol', 'tokens.decimal', 'tokens.address', 'tokens.isCustom')
                .leftJoin('tokens', 'tokenId', 'tokens.id')
                .leftJoin('token_prices', 'tokens.symbol', 'token_prices.symbol')
                .where({ walletId: walletId, recordState: 1 });

            promise.then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

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
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    controller.prototype.walletTokens_selectById = walletTokens_selectById;

    controller.prototype.wallet_tokens_insert = (data) => {
        data.recordState = 1;

        return new Promise((resolve, reject) => {
            insertIntoTable('wallet_tokens', data).then((rowData) => {
                walletTokens_selectById(rowData.id).then((walletData) => {
                    resolve(walletData);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    controller.prototype.wallet_tokens_update = (data) => {
        return updateById('wallet_tokens', data);
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

    function _update (table, args, where, tx) {
        let query = knex(table);

        if (tx) {
            query = query.transacting(tx);
        }

        if (where) {
            query = query.where(where);
        }

        return query.update(args);
    }

    /**
     * id_attribute_item_values
     */
    controller.prototype.idAttributeItemValues_addStaticData = (args) => {
        return knex.transaction((trx) => {
            let selectPromise = knex('id_attribute_item_values').transacting(trx).select().where('id', args.idAttributeItemValueId);
            selectPromise.then((idAttributeItemValues) => {
                return new Promise((resolve, reject) => {
                    if (idAttributeItemValues && idAttributeItemValues.length) {
                        let idAttributeItemValue = idAttributeItemValues[0];

                        // update idAttributeItemValue
                        idAttributeItemValue.updatedAt = new Date().getTime();

                        if (args.staticData) {
                            idAttributeItemValue.staticData = JSON.stringify(staticData);
                        }

                        let updatePromise = knex('id_attribute_item_values').transacting(trx).update(idAttributeItemValue).where('id', idAttributeItemValue.id);
                        updatePromise.then((rows) => {
                            resolve(idAttributeItemValue);
                        }).catch((error) => {
                            reject(error);
                        });
                    } else {
                        reject({ message: 'record_not_found' });
                    }
                });
            })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }

    controller.prototype.idAttributeItemValues_addDocument = (args) => {
        return knex.transaction((trx) => {
            let selectPromise = knex('id_attribute_item_values').transacting(trx).select().where('id', args.idAttributeItemValueId);
            selectPromise.then((idAttributeItemValues) => {
                return new Promise((resolve, reject) => {
                    if (idAttributeItemValues && idAttributeItemValues.length) {
                        let idAttributeItemValue = idAttributeItemValues[0];

                        // update idAttributeItemValue
                        idAttributeItemValue.updatedAt = new Date().getTime();

                        if (idAttributeItemValue.documentId) {
                            let selectPromise = knex('documents').transacting(trx).select().where('id', idAttributeItemValue.documentId);
                            selectPromise.then((documents) => {

                                documents[0].name = args.fileName;
                                documents[0].buffer = args.buffer;
                                documents[0].size = args.size;
                                documents[0].mimeType = args.mimeType;
                                documents[0].updatedAt = new Date().getTime();

                                let updatePromise = knex('documents').transacting(trx).update(documents[0]).where('id', documents[0].id);

                                updatePromise.then((updatedIds) => {
                                    resolve(idAttributeItemValue);
                                }).catch((error) => {
                                    reject(error);
                                })
                            }).catch((error) => {
                                reject(error);
                            });
                        } else {
                            knex('documents').transacting(trx).insert({
                                buffer: args.buffer,
                                name: args.fileName,
                                mimeType: args.mimeType,
                                size: args.size,
                                createdAt: new Date().getTime()
                            }).then((rows) => {
                                idAttributeItemValue.documentId = rows[0];
                                let updatePromise = knex('id_attribute_item_values').transacting(trx).update(idAttributeItemValue).where('id', idAttributeItemValue.id);
                                updatePromise.then((rows) => {
                                    resolve(idAttributeItemValue);
                                }).catch((error) => {
                                    reject(error);
                                });
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    } else {
                        reject({ message: "record_not_found" });
                    }
                });
            })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }

    controller.prototype.idAttributeItemValues_updateStaticData = (args) => {
        return knex.transaction((trx) => {
            let selectPromise = knex('id_attribute_item_values').transacting(trx).select().where('id', args.id);
            selectPromise.then((rows) => {
                return new Promise((resolve, reject) => {
                    let idAttributeItemValue = rows[0];

                    if (args.staticData) {
                        args.staticData = JSON.stringify(args.staticData);
                    }

                    knex('id_attribute_item_values').transacting(trx).update(args).where('id', args.id).then((updatedIds) => {
                        resolve(rows);
                    }).catch((error) => {
                        reject({ message: "error", error: error });
                    });
                });
            })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }

    controller.prototype.idAttributeItemValues_updateDocument = (args) => {
        return knex.transaction((trx) => {
            let selectPromise = select('id_attribute_item_values', { 'id': args.id }, trx);
            selectPromise.then((rows) => {
                return new Promise((resolve, reject) => {
                    let idAttributeItemValue = rows[0];

                    select('documents', { 'id': idAttributeItemValue.documentId }, trx).then((documents) => {
                        if (documents && documents.length) {
                            let document = documents[0];

                            document.name = args.name;
                            document.buffer = args.buffer;
                            document.mimeType = args.mimeType;
                            document.size = args.size;
                            document.updatedAt = new Date().getTime();

                            knex('documents').transacting(trx).update(document).where("id", document.id).then((updatedIds) => {
                                resolve(rows);
                            }).catch((error) => {
                                reject({ message: "error", error: error });
                            });
                        } else {
                            let document = {
                                name: args.name,
                                buffer: args.buffer,
                                mimeType: args.mimeType,
                                size: args.size,
                                createdAt: new Date().getTime()
                            }

                            knex('documents').transacting(trx).insert(document).then((insertedIds) => {
                                if (insertedIds && insertedIds.length) {
                                    let updateData = {
                                        documentId: insertedIds[0]
                                    }
                                    knex('id_attribute_item_values').transacting(trx).update(updateData).where('id', args.id).then((updatedIds) => {
                                        resolve(rows);
                                    }).catch((error) => {
                                        reject({ message: "error", error: error });
                                    });
                                } else {
                                    reject({ message: "error" });
                                }
                            }).catch((error) => {
                                reject({ message: "error", error: error });
                            });
                        }
                    }).catch((error) => {
                        reject({ message: "error", error: error });
                    })
                });
            })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }

    /**
     * documents
     */
    /*
    controller.prototype.documents_selectById = (id) => {
        return selectById('documents', id);
    }
    */

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

    /**
     * token_prices
     */
    controller.prototype.tokenPrices_selectAll = () => {
        return new Promise((resolve, reject) => {
            knex('token_prices').select().then((rows) => {
                if (rows && rows.length) {
                    resolve(rows);
                } else {
                    resolve(null);
                }
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    controller.prototype.tokenPrices_selectBySymbol = (symbol) => {
        return selectTable('token_prices', { symbol: symbol });
    }

    controller.prototype.tokenPrices_insert = (data) => {
        return insertIntoTable('token_prices', data);
    }

    controller.prototype.tokenPrices_update = (data) => {
        return updateById('token_prices', data);
    }

    /**
     * transactions history
     */
    controller.prototype.transactionsHistory_selectAll = () => {
        return new Promise((resolve, reject) => {
            knex('transactions_history').select().then((rows) => {
                if (rows && rows.length) {
                    resolve(rows);
                } else {
                    resolve([]);
                }
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    controller.prototype.transactionsHistory_selectByWalletId = (id) => {
        return selectTable('transactions_history', { walletId: id });
    }

    controller.prototype.transactionsHistory_selectByWalletIdAndTokenId = (query) => {
        return selectTable('transactions_history', { walletId: query.walletId, tokenId: query.tokenId });
    }

    controller.prototype.transactionsHistory_insert = (data) => {
        return insertIntoTable('transactions_history', data);
    }

    function insertIntoTable(table, data, trx) {
        return new Promise((resolve, reject) => {
            let promise = null;
            if (!trx) {
                promise = knex(table).insert(data);
            } else {
                promise = knex(table).transacting(trx).insert(data);
            }

            promise.then((resp) => {
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
                        resolve(rows[0]);
                    } else {
                        reject({ message: "error_while_creating" });
                    }
                }).catch((error) => {
                    reject({ message: "error_while_creating", error: error });
                });
            }).catch((error) => {
                console.log(error);
                reject({ message: "error_while_creating", error: error });
            })
        });
    }

    function updateById(table, data) {
        return new Promise((resolve, reject) => {
            data.updatedAt = new Date().getTime();
            knex(table).update(data).where('id', '=', data.id).then((resp) => {
                if (!resp || resp !== 1) {
                    return reject({ message: "error_while_updating" });
                }

                knex.select().from(table).where('id', data.id).then((rows) => {
                    if (rows && rows.length === 1) {
                        resolve(rows[0]);
                    } else {
                        reject({ message: "error_while_updating" });
                    }
                }).catch((error) => {
                    reject({ message: "error_while_updating", error: error });
                });
            }).catch((error) => {
                reject({ message: "error_while_updating", error: error });
            })
        });
    }

    // TODO remove
    function getById(table, id) {
        return selectById(table, id);
    }

    function selectById(table, id) {
        return new Promise((resolve, reject) => {
            knex(table).select().where('id', id).then((rows) => {
                rows && rows.length ? resolve(rows[0]) : resolve(null);
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
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

            promise.then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    return controller;
};
