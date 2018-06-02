const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'documents';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    Controller.init = _init;
    Controller.findById = _findById

    function _init() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.increments('id');
                        table.string('name').notNullable();
                        table.string('mimeType').notNullable();
                        table.integer('size').notNullable();
                        table.binary('buffer').notNullable();
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

    function _findById(id) {
        return new Promise((resolve, reject) => {
            sqlLiteService.select(TABLE_NAME, "*", { id: id }).then((rows) => {
                resolve(rows[0]);
            }).catch((error) => {
                reject({ message: "document_findById", error: error });
            })
        });
    }

    return Controller;
}
