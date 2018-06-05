const Promise = require('bluebird');

const initialIdAttributeTypeList = require('../../assets/data/initial-id-attribute-type-list.json');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'id_attribute_types';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    Controller.init = () => {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.string('key').primary();
                        table.string('category').notNullable();
                        table.string('type').notNullable();
                        table.string('entity').notNullable();
                        table.integer('isInitial').defaultTo(0)
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                    }).then((resp) => {
                        let promises = [];
                        for (let i in initialIdAttributeTypeList) {
                            let item = initialIdAttributeTypeList[i];
                            item.entity = JSON.stringify(item.entity);
                            promises.push(knex(TABLE_NAME).insert({ key: item.key, category: item.category, type: item.type, entity: item.entity, isInitial: 1, createdAt: new Date().getTime() }))
                        }
                        Promise.all(promises).then((resp) => {
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

    Controller.create = (data) => {
        return new Promise((resolve, reject) => {
            return knex(TABLE_NAME).select().where("key", data.key).then((rows) => {
                if (rows && rows.length) {
                    resolve(rows[0]);
                } else {
                    let dataToSave = {
                        key: data.key,
                        type: data.type[0],
                        category: data.category,
                        entity: JSON.stringify(data.entity),
                        createdAt: new Date().getTime()
                    };
                    return knex(TABLE_NAME).insert(dataToSave).then((insertedIds) => {
                        dataToSave.id = insertedIds[0];
                        resolve(dataToSave);
                    }).catch((error) => {
                        reject({ message: "error", error: error });
                    });
                }
            }).catch((error) => {
                reject({ message: "error", error: error });
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
