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
					// eslint-disable-next-line prefer-promise-reject-errors
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	};

	return Controller;
};
