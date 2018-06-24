const countriesList = require('../../assets/data/country-list.json');

const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'countries';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

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
