const Promise = require('bluebird');
const isSyncing = require('../tx-history-service').isSyncing;

module.exports = function (app, sqlLiteService) {
    const TABLE_NAME = 'tx_history';
    const Controller = function () { };

    let knex = sqlLiteService.knex;

    /**
     *
     */
    Controller.init = _init;
    Controller.addOrUpdate = _addOrUpdate;
    Controller.findByTxHash = _findByTxHash;
    Controller.findByPublicKey = _findByPublicKey;
    Controller.findByPublicKeyAndTokenSymbol = _findByPublicKeyAndTokenSymbol;
    Controller.findByPublicKeyAndContractAddress = _findByPublicKeyAndContractAddress;

    /**
     *
     */
    function _init() {
        return new Promise((resolve, reject) => {
            knex.schema.hasTable(TABLE_NAME).then((exists) => {
                if (!exists) {
                    knex.schema.createTable(TABLE_NAME, (table) => {
                        table.increments('id');
                        table.string('hash').unique().notNullable();
                        table.integer('blockNumber');
                        table.integer('timeStamp').notNullable();
                        table.integer('nonce').notNullable();
                        table.string('blockHash');
                        table.string('contractAddress');
                        table.string('from').notNullable();
                        table.string('to').notNullable();
                        table.integer('value').notNullable();
                        table.string('tokenName');
                        table.string('tokenSymbol');
                        table.integer('tokenDecimal');
                        table.integer('transactionIndex').notNullable();
                        table.integer('gas').notNullable();
                        table.integer('gasPrice').notNullable();
                        table.integer('cumulativeGasUsed');
                        table.integer('gasUsed');
                        table.string('input');
                        table.integer('confirmations');
                        table.integer('isError');
                        table.integer('txReceiptStatus').notNullable();
                        table.integer('networkId').notNullable();
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

    async function _addOrUpdate(txHistory) {
        let records = await _findByTxHash(txHistory.hash);
        let record = records ? records[0] : null;
        if (record) {
            Object.assign(record, txHistory);
            return sqlLiteService.updateById(TABLE_NAME, record);
        }
        return sqlLiteService.insertIntoTable(TABLE_NAME, txHistory);
    }

    async function _findByTxHash(hash) {
        return await knex(TABLE_NAME).where({ hash: hash });
    }

    async function _findByPublicKeyAndContractAddress(publicKey, contractAddress) {
        publicKey = publicKey.toLowerCase();
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).where({ from: publicKey, contractAddress }).
                orWhere({ to: publicKey, contractAddress }).orderBy('timeStamp', 'desc').then(rows => {
                    resolve({
                        data: rows,
                        isSyncing: isSyncing()
                    });
                }).catch((err) => {
                    return reject('Error while loading transaction history');
                });
        });
    }

    async function _findByPublicKey(publicKey) {
        //publicKey = '0xb198F16C4C4eB5d67cFA2d6297D0E779735736A2'.toLowerCase();
        publicKey = publicKey.toLowerCase();
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).where({ from: publicKey }).orWhere({ to: publicKey }).
                orderBy('timeStamp', 'desc').then(rows => {
                    resolve({
                        data: rows,
                        isSyncing: isSyncing()
                    });
                }).catch((err) => {
                    return reject('Error while loading transaction history');
                });
        });
    }

    async function _findByPublicKeyAndTokenSymbol(publicKey, tokenSymbol) {
        publicKey = publicKey.toLowerCase();
        return new Promise((resolve, reject) => {
            knex(TABLE_NAME).where({ from: publicKey, tokenSymbol }).
                orWhere({ to: publicKey, tokenSymbol }).orderBy('timeStamp', 'desc').then(rows => {
                    resolve({
                        data: rows,
                        isSyncing: isSyncing()
                    });
                }).catch((err) => {
                    return reject('Error while loading transaction history');
                });
        });
    }

    return Controller;
}
