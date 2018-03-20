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
                        table.increments('id');
                        table.string('name').notNullable();
                        table.string('logoUrl');
                        table.string('code');
                        table.string('title');
                        table.string('wallet');
                        table.string('company');
                        table.string('email');
                        table.string('keyPerson');
                        table.string('description');
                        table.string('acceptsFiat');
                        table.string('buySellFee');
                        table.string('yearLaunched');
                        table.string('personalAccount');
                        table.string('creditDebitDepositFee');
                        table.string('twoFactorAuthentication');
                        table.string('bankTransferDepositFee');
                        table.string('bankTransferWithdrawalFee');
                        table.string('type');
                        table.string('goodFor');
                        table.string('languages');
                        table.string('headquarters');
                        table.string('regulatedBy');
                        table.string('fiatPayments');
                        table.string('currencyPairs');
                        table.string('fiatSupported');
                        table.string('kycIndividuals');
                        table.string('osAvailability');
                        table.string('cryptoSupported');
                        table.string('deviceAvailability');
                        table.string('countriesSupported');
                        table.string('fiatWithdrawalMethods');
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

    Controller.create = (data) => {
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).select().where("name", data.name).then((rows) => {
                if (rows && rows.length) {
                    resolve(rows[0]);
                } else {
                    data.createdAt = new Date().getTime();
                    knex(TABLE_NAME).insert(data).then((insertedIds) => {
                        data.id = insertedIds[0];
                        resolve(data);
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
};