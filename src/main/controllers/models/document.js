const { knex, sqlUtil } = require('../../services/knex');

const TABLE_NAME = 'documents';

module.exports = {
	TABLE_NAME,
	findById: id => sqlUtil.selectOneById(TABLE_NAME, '*', id, tx)
};
