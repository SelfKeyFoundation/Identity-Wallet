const ethTokensList = require('./../../../assets/data/eth-tokens.json');

const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'token_prices';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    /**
     *
     */
    Controller.init = _init;
    Controller.findAll = _findAll;
    Controller.findBySymbol = _findBySymbol;
    Controller.add = _add;
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
                        table.string('name').notNullable();
                        table.string('symbol').notNullable().unique();
                        table.string('source');
                        table.decimal('priceUSD');
                        table.decimal('priceBTC');
                        table.decimal('priceETH');
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
            knex(TABLE_NAME).select().then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "error_findAll", error: error });
            });
        });
    }

    function _findBySymbol(symbol) {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).select().where({ symbol: symbol }).then((rows) => {
                resolve(rows && rows.length ? rows[0] : null);
            }).catch((error) => {
                reject({ message: "error_findAll", error: error });
            });
        });
    }

    function _add (tokenPrice) {
        return sqlLiteService.insertIntoTable(TABLE_NAME, tokenPrice);
    }

    function _edit(tokenPrice) {
        return sqlLiteService.updateById(TABLE_NAME, tokenPrice);
    }

    return Controller;
}
