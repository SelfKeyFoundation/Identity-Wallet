const { knex } = require('../../services/knex');

const TABLE_NAME = 'id_attribute_types';

module.exports = () => ({
	create: data => {
		const dataToSave = {
			key: data.key,
			type: data.type[0],
			category: data.category,
			entity: JSON.stringify(data.entity),
			createdAt: new Date().getTime()
		};

		return knex(TABLE_NAME)
			.insert(dataToSave)
			.then(insertedIds => {
				dataToSave.id = insertedIds[0];

				return dataToSave;
			});
	},

	findAll: () => knex(TABLE_NAME).select(),

	import: attributeTypes => {}
});
