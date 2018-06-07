const countriesList = require('../../assets/data/country-list.json');

const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'countries';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    Controller.init = () => {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.increments('id');
                        table.string('name').unique().notNullable();
                        table.string('code').unique().notNullable();
                        table.string('dialCode').notNullable();
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                    }).then((resp) => {
                        let promises = [];

                        for (let i in countriesList) {
                            let item = countriesList[i];
                            item.createdAt = new Date().getTime();
                            item.dialCode = item.dialCode;

                            delete item.dialCode;

                            promises.push(sqlLiteService.insertIntoTable(TABLE_NAME, item));
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

    Controller.findAll = () => {
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
