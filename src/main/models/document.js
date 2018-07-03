const { knex, sqlUtil } = require('../services/knex');

const TABLE_NAME = 'documents';

module.exports = {
	TABLE_NAME,
	findById: (id, tx) => sqlUtil.selectOneById(TABLE_NAME, '*', id, tx),
	create: (file, tx) => sqlUtil.insertAndSelect(TABLE_NAME, file, tx),
	delete: (id, tx) => sqlUtil.delete(TABLE_NAME, { id }, tx)
};
