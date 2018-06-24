const Promise = require('bluebird');

const initialIdAttributeTypeList = require('../../assets/data/initial-id-attribute-type-list.json');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'id_attribute_types';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

	Controller.create = data => {
		return new Promise((resolve, reject) => {
			return knex(TABLE_NAME)
				.select()
				.where('key', data.key)
				.then(rows => {
					if (rows && rows.length) {
						resolve(rows[0]);
					} else {
						let dataToSave = {
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
								resolve(dataToSave);
							})
							.catch(error => {
								reject({ message: 'error', error: error });
							});
					}
				})
				.catch(error => {
					reject({ message: 'error', error: error });
				});
		});
	};

	Controller.findAll = () => {
		return new Promise((resolve, reject) => {
			knex(TABLE_NAME)
				.select()
				.then(rows => {
					resolve(rows);
				})
				.catch(error => {
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	};

	return Controller;
};
