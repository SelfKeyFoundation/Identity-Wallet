const { knex, sqlUtil } = require('../../services/knex');

const TABLE_NAME = 'id_attribute_types';

module.exports = {
	TABLE_NAME,

	create: (data, tx) => {
		const dataToSave = {
			key: data.key,
			type: data.type[0],
			category: data.category,
			entity: JSON.stringify(data.entity)
		};
		return sqlUtil.insertAndSelect(TABLE_NAME, data, tx);
	},

	findAll: tx => sqlUtil.select(TABLE_NAME, '*', null, tx),

	import: attributeTypes => {}
};
