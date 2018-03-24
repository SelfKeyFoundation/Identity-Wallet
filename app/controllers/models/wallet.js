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
    Controller.addInitialIdAttributesAndActivate = _addInitialIdAttributesAndActivate;

    Controller.findActive = _findActive;
    Controller.findAll = _findAll;
    Controller.findByPublicKey = _findByPublicKey;

    Controller.selectProfilePictureById = _selectProfilePictureById;
    Controller.updateProfilePicture = _updateProfilePicture;


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
                console.log("########", e);
                reject(e);
            });
        });
    }

    function _addInitialIdAttributesAndActivate(walletId, initialIdAttributes) {
        console.log(walletId, initialIdAttributes)
        return knex.transaction((trx) => {

            sqlLiteService.select(TABLE_NAME, "*", { id: walletId }, trx).then((rows) => {
                let wallet = rows[0]

                let promises = [];

                return new Promise((resolve, reject) => {

                    let idAttributesSavePromises = [];
                    let idAttributeItemsSavePromises = [];
                    let idAttributeItemValuesSavePromises = [];

                    sqlLiteService.select('id_attribute_types', '*', { isInitial: 1 }, trx).then((idAttributeTypes) => {
                        for (let i in idAttributeTypes) {
                            let idAttributeType = idAttributeTypes[i];

                            // add initial id attributes
                            idAttributesSavePromises.push(sqlLiteService.insertIntoTable('id_attributes', { walletId: wallet.id, idAttributeType: idAttributeType.key, createdAt: new Date().getTime() }, trx).then((idAttribute) => {
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

                            wallet.isSetupFinished = 1;

                            sqlLiteService.update(TABLE_NAME, wallet, { id: wallet.id }, trx).then(() => {
                                resolve(wallet);
                            }).catch((error) => {
                                console.log("?????????? 11", error);
                                reject({ message: "wallets_insert_error", error: error });
                            })
                        }).catch((error) => {
                            console.log("?????????? 22", error);
                            reject({ message: "wallets_insert_error", error: error });
                        });
                    }).catch((error) => {
                        console.log("?????????? 33", error);
                        reject({ message: "wallets_insert_error", error: error });
                    });
                });
            })
                .then(trx.commit)
                .catch(trx.rollback);
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
            let selectPromise = knex('wallets').transacting(trx).select().where('id', args.id);
            selectPromise.then((rows) => {
                return new Promise((resolve, reject) => {
                    let wallet = rows[0];

                    wallet.profilePicture = args.profilePicture;

                    knex('wallets').transacting(trx).update(wallet).where('id', args.id).then((updatedData) => {
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
            knex('wallets').select().where('id', args.id).then((rows) => {
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
