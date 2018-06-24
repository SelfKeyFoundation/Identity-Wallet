const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'exchange_data';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

	Controller.create = data => {
		return new Promise((resolve, reject) => {
			return knex(TABLE_NAME)
				.select()
				.where('name', data.name)
				.then(rows => {
					if (rows && rows.length) {
						data.updatedAt = new Date().getTime();
						return knex(TABLE_NAME)
							.update(data)
							.where('name', '=', data.name)
							.then(resp => {
								if (!resp || resp !== 1) {
									return reject({ message: 'error_while_updating' });
								}
								return knex
									.select()
									.from(TABLE_NAME)
									.where('name', data.name)
									.then(newRows => {
										if (newRows && newRows.length) {
											return resolve(newRows[0]);
										} else {
											return reject({ message: 'error_while_updating' });
										}
									})
									.catch(error => {
										return reject({
											message: 'error_while_updating',
											error: error
										});
									});
							});
					} else {
						return knex(TABLE_NAME)
							.insert(data)
							.then(insertedIds => {
								return resolve(data);
							})
							.catch(error => {
								return reject({ message: 'error', error: error });
							});
					}
				})
				.catch(error => {
					return reject({ message: 'error', error: error });
				});
		});
	};

	Controller.findAll = () => {
		return new Promise((resolve, reject) => {
			return knex(TABLE_NAME)
				.select()
				.then(rows => {
					let data = (rows || []).map(e => {
						return { name: e.name, data: JSON.parse(e.data) };
					});
					return resolve(data);
				})
				.catch(error => {
					return reject({ message: 'error_while_selecting', error: error });
				});
		});
	};

	return Controller;
};
