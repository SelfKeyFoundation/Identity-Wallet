const electron = require('electron');
const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'wallets';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    /**
     *
     */
    Controller.init = _init;
    Controller.add = _add;


    /**
     *
     */
    function _init() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.increments('id');
                        table.string('name');
                        table.string('publicKey').unique().notNullable();
                        table.string('privateKey');
                        table.string('keystoreFilePath');
                        table.binary('profilePicture');
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

    function _add(data, initialIdAttributes) {
        data.createdAt = new Date().getTime();

        return knex.transaction((trx) => {
            knex(TABLE_NAME)
                .transacting(trx)
                .insert(data)
                .then((insertedIds) => {
                    let id = insertedIds[0];

                    let promises = [];

                    // add wallet settings
                    promises.push(sqlLiteService.insertIntoTable('wallet_settings', { walletId: id, sowDesktopNotifications: 1, createdAt: new Date().getTime() }, trx));

                    // add wallet tokens
                    promises.push(sqlLiteService.insertIntoTable('wallet_tokens', { walletId: id, tokenId: 1, createdAt: new Date().getTime() }, trx));

                    return new Promise((resolve, reject) => {
                        Promise.all(promises).then(() => {
                            let idAttributesSavePromises = [];
                            let idAttributeItemsSavePromises = [];
                            let idAttributeItemValuesSavePromises = [];

                            sqlLiteService.select('id_attribute_types', '*', { isInitial: 1 }, trx).then((idAttributeTypes) => {
                                for (let i in idAttributeTypes) {
                                    let idAttributeType = idAttributeTypes[i];

                                    // add initial id attributes
                                    idAttributesSavePromises.push(sqlLiteService.insertIntoTable('id_attributes', { walletId: id, idAttributeType: idAttributeType.key, createdAt: new Date().getTime() }, trx).then((idAttribute) => {

                                        idAttributeItemsSavePromises.push(sqlLiteService.insertIntoTable('id_attribute_items', { idAttributeId: idAttribute.id, isVerified: 0, createdAt: new Date().getTime() }).then((idAttributeItem) => {
                                            let staticData = JSON.stringify({ line1: initialIdAttributes[idAttributeType.key] });
                                            idAttributeItemValuesSavePromises.push(sqlLiteService.insertIntoTable('id_attribute_item_values', { idAttributeItemId: idAttributeItem.id, staticData: staticData, createdAt: new Date().getTime() }));
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



    return Controller;
}
