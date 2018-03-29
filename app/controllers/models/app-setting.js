const electron = require('electron');
const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'app_settings';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    /**
     *
     */
    Controller.init = _init;

    /**
     *
     */
    function _init() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.increments('id');
                        table.string('dataFolderPath').notNullable();
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                    }).then((resp) => {
                        sqlLiteService.insertIntoTable(TABLE_NAME, { dataFolderPath: electron.app.getPath('userData'), createdAt: new Date().getTime() }).then(() => {
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

    return Controller;
}
