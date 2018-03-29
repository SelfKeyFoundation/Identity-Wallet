const electron = require('electron');
const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'wallet_settings';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    /**
     *
     */
    Controller.init = _init;
    Controller.findByWalletId = _findByWalletId;
    Controller.edit = _edit;


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
                        table.integer('sowDesktopNotifications').notNullable().defaultTo(0);
                        table.integer('ERC20TxHistoryLastBlock');
                        table.integer('EthTxHistoryLastBlock');
                        table.string('airDropCode');
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

    function _findByWalletId(walletId) {
        return sqlLiteService.select(TABLE_NAME, "*", {walletId: walletId});
    }

    function _edit(data) {
        return sqlLiteService.update(TABLE_NAME, data, {id: data.id});
    }

    return Controller;
}
