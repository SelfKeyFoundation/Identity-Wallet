const Promise = require('bluebird');

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'guide_settings';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    /**
     *
     */
    Controller.init = _init;
    Controller.findAll = _findAll;
    Controller.updateById = _updateById;

    /**
     *
     */
    function _init() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then(function (exists) {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.increments('id');
                        table.integer('guideShown').defaultTo(0);
                        table.integer('icoAdsShown').defaultTo(0);
                        table.integer('termsAccepted').defaultTo(0);
                        table.integer('createdAt').notNullable();
                        table.integer('updatedAt');
                    }).then((resp) => {
                        sqlLiteService.insertIntoTable(TABLE_NAME, { guideShown: 0, icoAdsShown: 0, termsAccepted: 0, createdAt: new Date().getTime() }).then(() => {
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

    function _findAll() {
        return sqlLiteService.select(TABLE_NAME, "*");
    }

    function _updateById(id, data) {
        return sqlLiteService.update(TABLE_NAME, data, { id: id });
    }

    return Controller;
}
