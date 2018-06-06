const ethTokensList = require('../../assets/data/eth-tokens.json');

const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'tokens';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    /**
     *
     */
    Controller.init = _init;
    Controller.findAll = _findAll;

    /**
     *
     */
    function _init() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.increments('id');
                        table.string('symbol').unique().notNullable();
                        table.integer('decimal').notNullable();
                        table.string('address').notNullable();
                        table.binary('icon');
                        table.integer('isCustom').notNullable().defaultTo(0);
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                        table.string('type').notNullable();
                    }).then((resp) => {
                        let promises = [];

                        for (let i in ethTokensList) {
                            let item = ethTokensList[i];
                            promises.push(sqlLiteService.insertIntoTable('tokens', { address: item.address, symbol: item.symbol, decimal: item.decimal, createdAt: new Date().getTime() }));
                        }

                        Promise.all(promises).then(() => {
                            resolve("Table: " + TABLE_NAME + " created.");
                        }).catch((error) => {
                            reject(error);
                        });
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
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    return Controller;
}
