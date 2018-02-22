'use strict';

const electron = require('electron');
const path = require('path');

const countriesList = require('./../../assets/data/country-list.json');
const ethTokensList = require('./../../assets/data/eth-tokens.json');

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

    // select wallets.id , json_extract(wallets.name, '$.test') as phone from wallets where phone = 'is';

    controller.prototype.init = () => {

        /**
         * countries
         */
        knex.schema.hasTable('countries').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('countries', (table) => {
                    table.increments('id');
                    table.string('name').unique().notNullable();
                    table.string('code').unique().notNullable();
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    for(let i in countriesList){
                        let item = countriesList[i];
                        createById('countries', item);
                    }
                    console.log("Table:", "countries", "created.");
                });
            }
        });

        /**
         * documents
         */
        knex.schema.hasTable('documents').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('documents', (table) => {
                    table.increments('id');
                    table.string('filename').notNullable();
                    table.string('mime_type').notNullable();
                    table.integer('size').notNullable();
                    table.binary('file').notNullable();
                    table.integer('created_at').notNullable().defaultTo(new Date().getTime());
                    table.integer('updated_at');
                }).then((resp) => {
                    console.log("Table:", "documents", "created.");
                });
            }
        });

        /**
         * id_attribute_types
         */
        knex.schema.hasTable('id_attribute_types').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('id_attribute_types', (table) => {
                    table.increments('id');
                    table.string('key').notNullable();
                    table.string('category').unique().notNullable();
                    table.string('type').notNullable();
                    table.string('entity').notNullable();
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    console.log("Table:", "id_attribute_types", "created.");
                });
            }
        });

        /**
         * tokens
         */
        knex.schema.hasTable('tokens').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('tokens', (table) => {
                    table.increments('id');
                    table.string('symbol').unique().notNullable();
                    table.integer('decimal').notNullable();
                    table.string('address').notNullable();
                    table.binary('icon');
                    table.integer('isCustom').notNullable().defaultTo(0);
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    for(let i in ethTokensList){
                        let item = ethTokensList[i];
                        createById('tokens', {address: item.address, symbol: item.symbol, decimal: item.decimal});
                    }
                    console.log("Table:", "tokens", "created.");
                });
            }
        });

        /**
         * app_settings
         */
        knex.schema.hasTable('app_settings').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('app_settings', (table) => {
                    table.increments('id');
                    table.string('dataFolderPath').notNullable();
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    createById('app_settings', { dataFolderPath: electron.app.getPath('userData') });
                    console.log("Table:", "app_settings", "created.");
                });
            }
        });

        /**
         * guide_settings
         */
        knex.schema.hasTable('guide_settings').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('guide_settings', (table) => {
                    table.increments('id');
                    table.integer('guideShown').defaultTo(0);
                    table.integer('icoAdsShown').defaultTo(0);
                    table.integer('termsAccepted').defaultTo(0);
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    createById('guide_settings', { guideShown: 0, icoAdsShown: 0, termsAccepted: 0 });
                    console.log("Table:", "app_settings", "created.");
                });
            }
        });

        /**
         * wallets
         */
        knex.schema.hasTable('wallets').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('wallets', (table) => {
                    table.increments('id');
                    table.string('name');
                    table.string('publicKey').unique().notNullable();
                    table.string('privateKey');
                    table.string('keystoreFilePath');
                    table.binary('profilePicture');
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    console.log("Table:", "wallets", "created.");
                });
            }
        });

        /**
         * id_attributes
         */
        knex.schema.hasTable('id_attributes').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('id_attributes', (table) => {
                    table.increments('id');
                    table.integer('walletId').notNullable().references('wallets.id');
                    table.integer('idAttributeTypeId').notNullable().references('id_attribute_types.id');
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    console.log("Table:", "id_attributes", "created.");
                });
            }
        });

        /**
         * id_attribute_items
         */
        knex.schema.hasTable('id_attribute_items').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('id_attribute_items', (table) => {
                    table.increments('id');
                    table.integer('idAttributeId').notNullable().references('id_attributes.id');
                    table.string('name');
                    table.integer('isVerified').notNullable().defaultTo(0);
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    console.log("Table:", "id_attribute_items", "created.");
                });
            }
        });

        /**
         * id_attribute_item_values
         */
        knex.schema.hasTable('id_attribute_item_values').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('id_attribute_item_values', (table) => {
                    table.increments('id');
                    table.integer('idAttributeItemId').notNullable().references('id_attribute_items.id');
                    table.integer('documentId').references('documents.id');
                    table.string('staticData');
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    console.log("Table:", "id_attribute_item_values", "created.");
                });
            }
        });

        /**
         * token_prices
         */
        knex.schema.hasTable('token_prices').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('token_prices', (table) => {
                    table.increments('id');
                    table.string('symbol').notNullable().unique();
                    table.string('source');
                    table.decimal('priceUSD');
                    table.decimal('priceBTC');
                    table.decimal('priceETH');
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    console.log("Table:", "token_prices", "created.");
                });
            }
        });

        /**
         * token_prices
         */
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
                });
            }
        });

        /**
         * transactions_history
         */
        knex.schema.hasTable('transactions_history').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('transactions_history', (table) => {
                    table.increments('id');
                    table.integer('wallet_id').notNullable().references('wallets.id');
                    table.integer('token_id').notNullable().references('tokens.id');
                    table.string('tx_id').notNullable();
                    table.decimal('value').notNullable();
                    table.integer('timestamp').notNullable();
                    table.integer('blockNumber').notNullable();
                    table.integer('created_at').notNullable().defaultTo(new Date().getTime());
                    table.integer('updated_at');
                }).then((resp) => {
                    console.log("Table:", "transactions_history", "created.");
                });
            }
        });

        /**
         * action_logs
         */
        knex.schema.hasTable('action_logs').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('action_logs', (table) => {
                    table.increments('id');
                    table.integer('walletId').notNullable().references('wallets.id');
                    table.string('title');
                    table.string('content');
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    console.log("Table:", "action_logs", "created.");
                });
            }
        });

        /**
         * wallet_settings
         */
        knex.schema.hasTable('wallet_settings').then(function (exists) {
            if (!exists) {
                knex.schema.createTable('wallet_settings', (table) => {
                    table.increments('id');
                    table.integer('walletId').notNullable().references('wallets.id');
                    table.integer('sowDesktopNotifications').notNullable().defaultTo(0);
                    table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
                    table.integer('updatedAt');
                }).then((resp) => {
                    console.log("Table:", "wallet_settings", "created.");
                });
            }
        });
    }

    /**
     * wallets
     */
    controller.prototype.wallets_insert = (data) => {
        return createById('wallets', data);
    }

    controller.prototype.wallets_update = (data) => {
        return updateById('wallets', data);
    }

    controller.prototype.wallets_selectById = (id) => {
        return getById('wallets', id);
    }

    controller.prototype.wallets_selectByPublicKey = (publicKey) => {
        return new Promise((resolve, reject) => {
            knex('wallets').select().where('publicKey', publicKey).then((rows) => {
                if (rows && rows.length === 1) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            }).catch((error) => {
                reject({ message: "error_while_updating", error: error });
            });
        });
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
     * id_attribute_types
     */
    controller.prototype.idAttributeTypes_insert = (data) => {
        return createById('id_attribute_types', data);
    }

    controller.prototype.idAttributeTypes_update = (data) => {
        return updateById('id_attribute_types', data);
    }

    controller.prototype.idAttributeTypes_selectAll = () => {
        return new Promise((resolve, reject) => {
            knex('id_attribute_types').select().then((rows) => {
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
     * tokens
     */
    controller.prototype.tokens_selectAll = () => {
        return new Promise((resolve, reject) => {
            knex('tokens').select().then((rows) => {
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

    controller.prototype.tokenPrices_insert = (data) => {
        return createById('token_prices', data);
    }

    /**
     * guide_settings
     */
    controller.prototype.guideSettings_selectAll = () => {
        return new Promise((resolve, reject) => {
            knex('guide_settings').select().then((rows) => {
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

    controller.prototype.guideSettings_update = (data) => {
        return updateById('guide_settings', data);
    }

    /**
     *
     */
    function createById(table, data) {
        return new Promise((resolve, reject) => {
            knex.insert(data).into(table).then((resp) => {
                if (!resp || resp.length !== 1) {
                    return reject({ message: "error_while_creating" });
                }

                knex.select().from(table).where('id', resp[0]).then((rows) => {
                    if (rows && rows.length === 1) {
                        resolve(rows[0]);
                    } else {
                        reject({ message: "error_while_creating" });
                    }
                }).catch((error) => {
                    reject({ message: "error_while_creating", error: error });
                });
            }).catch((error) => {
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

    function getById(table, id) {
        return new Promise((resolve, reject) => {
            knex(table).select().where('id', id).then((rows) => {
                if (rows && rows.length === 1) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            }).catch((error) => {
                reject({ message: "error_while_updating", error: error });
            });
        });
    }

    return controller;
};
