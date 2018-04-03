const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'transactions_history';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    /**
     *
     */
    Controller.init = _init;
    Controller.findAll = _findAll;
    Controller.findByWalletId = _findByWalletId;
    Controller.findByWalletIdAndTokenId = _findByWalletIdAndTokenId;


    /**
     *
     */
    function _init() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
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
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                    }).then((resp) => {
                        resolve("Table: " + TABLE_NAME + " created.");
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    function _findAll() {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    function _findByWalletId(walletId) {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).where({ walletId: walletId }).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    function _findByWalletIdAndTokenId(walletId, tokenId) {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).where({ walletId: walletId, tokenId: tokenId }).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    return Controller;
}
