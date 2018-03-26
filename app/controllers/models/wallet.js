const electron = require('electron');
const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'wallets';
    const Controller = function () { };

    let knex = sqlLiteService.knex;
    let helpers = electron.app.helpers;

    /**
     *
     */
    Controller.init = _init;
    Controller.add = _add;
    Controller.addInitialIdAttributesAndActivate = _addInitialIdAttributesAndActivate;

    Controller.findActive = _findActive;
    Controller.findAll = _findAll;
    Controller.findByPublicKey = _findByPublicKey;

    Controller.selectProfilePictureById = _selectProfilePictureById;
    Controller.updateProfilePicture = _updateProfilePicture;

    /**
     *
     */
    // DONE !!!!!
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
                        table.integer('isSetupFinished').notNullable().defaultTo(0);
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

    // DONE !!!!!
    function _addInitialIdAttributesAndActivate(walletId, initialIdAttributes) {
        return knex.transaction((trx) => {

            sqlLiteService.select(TABLE_NAME, "*", { id: walletId }, trx).then((rows) => {
                let wallet = rows[0]

                return new Promise((resolve, reject) => {
                    sqlLiteService.select('id_attribute_types', '*', { isInitial: 1 }, trx).then((idAttributeTypes) => {
                        let idAttributesSavePromises = [];
                        for (let i in idAttributeTypes) {
                            let idAttributeType = idAttributeTypes[i];

                            let item = {
                                walletId: wallet.id,
                                idAttributeType: idAttributeType.key,
                                items: [],
                                createdAt: new Date().getTime()
                            };

                            item.items.push({
                                "id": helpers.generateId(),
                                "name": null,
                                "isVerified": 0,
                                "order": 0,
                                "createdAt": new Date().getTime(),
                                "updatedAt": null,
                                "values": [{
                                    "id": helpers.generateId(),
                                    "staticData": { line1: initialIdAttributes[idAttributeType.key] },
                                    "documentId": null,
                                    "order": 0,
                                    "createdAt": new Date().getTime(),
                                    "updatedAt": null
                                }]
                            })

                            item.items = JSON.stringify(item.items);

                            // add initial id attributes
                            idAttributesSavePromises.push(sqlLiteService.insertIntoTable('id_attributes', item, trx).catch((error)=>{
                                console.log(error);
                            }));
                        }

                        Promise.all(idAttributesSavePromises).then(() => {
                            wallet.isSetupFinished = 1;

                            sqlLiteService.update(TABLE_NAME, wallet, { id: wallet.id }, trx).then(() => {
                                resolve(wallet);
                            }).catch((error) => {
                                console.log(error);
                                reject({ message: "wallets_insert_error", error: error });
                            })
                        }).catch((error) => {
                            console.log(error);
                            reject({ message: "wallets_insert_error", error: error });
                        });
                    }).catch((error) => {
                        console.log(error);
                        reject({ message: "wallets_insert_error", error: error });
                    });
                });
            }).then(trx.commit).catch(trx.rollback);
        });
    }

    function _add(data) {
        return new Promise((resolve, reject) => {
            data.createdAt = new Date().getTime();
            knex.transaction((trx) => {
                return knex(TABLE_NAME).transacting(trx).insert(data).then((insertedIds) => {
                    let id = insertedIds[0];
                    data.id = id;

                    let promises = [];

                    // add wallet settings
                    promises.push(sqlLiteService.insertIntoTable('wallet_settings', { walletId: id, sowDesktopNotifications: 1, createdAt: new Date().getTime() }, trx));

                    // add wallet tokens
                    promises.push(sqlLiteService.insertIntoTable('wallet_tokens', { walletId: id, tokenId: 1, createdAt: new Date().getTime() }, trx));

                    return new Promise((resolve, reject) => {
                        Promise.all(promises).then(() => {
                            resolve(data);
                        }).catch((error) => {
                            reject({ message: "wallet_init_error", error: error });
                        });
                    });
                }).then(trx.commit).catch(trx.rollback);
            }).then((data) => {
                resolve(data);
            }).catch((e) => {
                reject(e);
            });
        });
    }



    function _findActive() {
        return new Promise((resolve, reject) => {
            sqlLiteService.select(TABLE_NAME, '*', { isSetupFinished: 1 }).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "wallet_findActive", error: error });
            })
        });
    }

    function _findAll() {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).select().whereNotNull('keystoreFilePath').then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject({ message: "wallet_findAll", error: error });
            })
        });
    }

    function _findByPublicKey(publicKey) {
        return new Promise((resolve, reject) => {
            sqlLiteService.select(TABLE_NAME, '*', { publicKey: publicKey }).then((rows) => {
                if (rows && rows.length === 1) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            }).catch((error) => {
                reject({ message: "wallet_findByPublicKey", error: error });
            })
        });
    }

    function _updateProfilePicture (args) {

        return knex.transaction((trx) => {
            let selectPromise = knex(TABLE_NAME).transacting(trx).select().where('id', args.id);
            selectPromise.then((rows) => {
                return new Promise((resolve, reject) => {
                    let wallet = rows[0];

                    wallet.profilePicture = args.profilePicture;

                    knex(TABLE_NAME).transacting(trx).update(wallet).where('id', args.id).then((updatedData) => {
                        resolve(wallet);
                    }).catch((error) => {
                        reject({ message: "error", error: error });
                    });
                });
            })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    }

    function _selectProfilePictureById (args) {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).select().where('id', args.id).then((rows) => {
                if (rows && rows.length) {
                    resolve(rows[0].profilePicture);
                } else {
                    resolve(null);
                }
            }).catch((error) => {
                reject({ message: "error_while_selecting_profile_picture", error: error });
            });
        });
    }

    return Controller;
}
