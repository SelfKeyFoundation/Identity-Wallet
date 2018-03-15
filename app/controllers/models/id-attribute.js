const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'id_attributes';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    Controller.init = () => {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then(function (exists) {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.increments('id');
                        table.integer('walletId').notNullable().references('wallets.id');
                        table.integer('idAttributeType').notNullable().references('id_attribute_types.key');
                        table.integer('order').defaultTo(0);
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

    Controller.create = (walletId, idAttributeType, staticData, file) => {
        let idAttribute = {};
        idAttribute.createdAt = new Date().getTime();
        idAttribute.walletId = walletId;
        idAttribute.idAttributeType = idAttributeType;
        idAttribute.order = 1;

        return knex.transaction((trx) => {
            let selectPromise = sqlLiteService.select(TABLE_NAME, "*", { 'walletId': walletId, 'idAttributeType': idAttributeType }, trx)
            selectPromise.then((rows) => {
                return new Promise((resolve, reject) => {
                    if (rows && rows.length) {
                        return reject({ message: "id_attribute_already_exists" });
                    }

                    let idAttributeQuery = sqlLiteService.insert(TABLE_NAME, idAttribute, trx);
                    idAttributeQuery.then((insertedIds) => {
                        if (!insertedIds || !insertedIds.length) {
                            return reject({ message: "error_while_adding_id_attribute" });
                        }

                        idAttribute.id = insertedIds[0];

                        let idAttributeItem = {
                            idAttributeId: idAttribute.id,
                            name: idAttribute.idAttributeType,
                            createdAt: new Date().getTime()
                        }

                        let idAttributeItemQuery = sqlLiteService.insert('id_attribute_items', idAttributeItem, trx);
                        idAttributeItemQuery.then((insertedIds) => {
                            if (!insertedIds || !insertedIds.length) {
                                return reject({ message: "error_while_adding_id_attribute" });
                            }

                            let idAttributeItemValue = {
                                idAttributeItemId: insertedIds[0],
                                createdAt: new Date().getTime()
                            }

                            if (staticData) {
                                idAttributeItemValue.staticData = JSON.stringify(staticData);
                            }

                            let idAttributeItemValueQuery = sqlLiteService.insert('id_attribute_item_values', idAttributeItemValue, trx);
                            idAttributeItemValueQuery.then((insertedIds) => {
                                if (!insertedIds || !insertedIds.length) {
                                    return reject({ message: "error_while_adding_id_attribute" });
                                }

                                if (file) {
                                    addFileToIdAttributeItemValue(insertedIds[0], file, trx).then(() => {
                                        selectById(idAttributeItem.idAttributeId, trx).then((rows) => {
                                            resolve(rows);
                                        }).catch((error) => {
                                            reject({ message: "error_while_adding_id_attribute", error: error });
                                        });
                                    }).catch((error) => {
                                        reject({ message: "error_while_adding_id_attribute", error: error });
                                    })
                                } else {
                                    selectById(idAttributeItem.idAttributeId, trx).then((rows) => {
                                        resolve(rows);
                                    }).catch((error) => {
                                        reject({ message: "error_while_adding_id_attribute", error: error });
                                    });
                                }
                            }).catch((error) => {
                                reject({ message: "error_while_adding_id_attribute", error: error });
                            });
                        }).catch((error) => {
                            reject({ message: "error_while_adding_id_attribute", error: error });
                        });
                    }).catch((error) => {
                        reject({ message: "error_while_adding_id_attribute", error: error });
                    });
                });
            })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }

    Controller.selectById = selectById;

    /**
     *
     */
    function selectById(id, trx) {
        return new Promise((resolve, reject) => {

            let selectQuery = sqlLiteService.select(TABLE_NAME, "*", { id: id }, trx);
            selectQuery.then((rows) => {
                if (!rows || !rows.length) {
                    return reject({ message: 'not_found' });
                }

                let idAttribute = null;

                let idAttributeItemPromises = [];
                let idAttributeItemValuesPromises = [];

                idAttribute = rows[0];


                idAttributeItemPromises.push(sqlLiteService.select('id_attribute_items', '*', { idAttributeId: idAttribute.id }, trx).then((items) => {
                    idAttribute.items = items ? items : [];

                    for (let j in items) {
                        idAttributeItemValuesPromises.push(selectIdAttributeItemValueView({ idAttributeItemId: items[j].id }, trx).then((values) => {
                            if (values) {
                                for (let i in values) {
                                    if (values[i].staticData) {
                                        values[i].staticData = JSON.parse(values[i].staticData);
                                    }
                                }
                                items[j].values = values;
                            } else {
                                items[j].values = [];
                            }
                        }));
                    }
                }));

                Promise.all(idAttributeItemPromises).then((items) => {
                    Promise.all(idAttributeItemValuesPromises).then((values) => {
                        resolve(idAttribute);
                    }).catch((error) => {
                        reject({ message: "error_while_selecting", error: error });
                    });
                }).catch((error) => {
                    reject({ message: "error_while_selecting", error: error });
                });
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    function selectIdAttributeItemValueView(where, trx) {
        return new Promise((resolve, reject) => {
            let promise = knex('id_attribute_item_values')
                .transacting(trx)
                .select('id_attribute_item_values.*', 'documents.name as documentFileName', 'id_attribute_items.id as idAttributeItemId', 'id_attributes.id as idAttributeId', 'id_attributes.idAttributeType', 'id_attributes.walletId')
                .leftJoin('id_attribute_items', 'id_attribute_item_values.idAttributeItemId', 'id_attribute_items.id')
                .leftJoin('id_attributes', 'id_attribute_items.idAttributeId', 'id_attributes.id')
                .leftJoin('documents', 'id_attribute_item_values.documentId', 'documents.id')
                .where(where);

            promise.then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "error_while_selecting", error: error });
            });
        });
    }

    function addFileToIdAttributeItemValue(id, file, trx) {
        let document = {
            buffer: file.buffer,
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
            createdAt: new Date().getTime()
        };

        return new Promise((resolve, reject) => {
            let selectPromise = sqlLiteService.select('id_attribute_item_values', "*", { id: id }, trx);
            selectPromise.then((rows) => {
                if (!rows || !rows.length) {
                    return reject({ message: "error_while_selecting" });
                }

                let idAttributeItemValue = rows[0];

                let insertDocumentPromise = sqlLiteService.insert('documents', document, trx);
                insertDocumentPromise.then((rows) => {
                    idAttributeItemValue.documentId = rows[0];
                    let updatePromise = knex('id_attribute_item_values').transacting(trx).update(idAttributeItemValue).where('id', idAttributeItemValue.id);
                    updatePromise.then((rows) => {
                        resolve(idAttributeItemValue);
                    }).catch((error) => {
                        reject({ message: "update_error", error: error });
                    });
                }).catch((error) => {
                    reject({ message: "insert_error", error: error });
                });
            }).catch((error) => {
                reject({ message: "insert_error", error: error });
            });
        });
    }

    return Controller;
}
