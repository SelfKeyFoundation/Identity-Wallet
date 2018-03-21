const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'exchange_data';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    Controller.init = () => {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.string('name').primary();
                        table.string('data').notNullable();
                        table.integer('createdAt').notNullable().defaultTo(new Date().getTime());
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
    };

    Controller.create = (data) => {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).select().where("name", data.name).then((rows) => {
                if (rows && rows.length) {
                    data.updatedAt = new Date().getTime();
                    knex(TABLE_NAME).update(data).where('name', '=', data.name).then((resp) => {
                        if (!resp || resp !== 1) {
                            return reject({ message: "error_while_updating" });
                        }
                        knex.select().from(TABLE_NAME).where('name', data.name).then((newRows) => {
                            if (newRows && newRows.length) {
                                resolve(newRows[0]);
                            } else {
                                reject({message: "error_while_updating"});
                            }
                        }).catch((error) => {
                            reject({ message: "error_while_updating", error: error });
                        });
                    });
                } else {
                    knex(TABLE_NAME).insert(data).then((insertedIds) => {
                        resolve(data);
                    }).catch((error) => {
                        reject({ message: "error", error: error });
                    });
                }
            }).catch((error) => {
                reject({ message: "error", error: error });
            });
        });
    };

    Controller.findAll = () => {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).select().then((rows) => {
                let data = (rows || []).map(e => {
                    return {name: e.name, data: JSON.parse(e.data)};
                });
                resolve(data);
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    };

    return Controller;
};
