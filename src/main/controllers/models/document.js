const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'documents';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

	Controller.findById = _findById;

	function _findById(id) {
		return new Promise((resolve, reject) => {
			sqlLiteService
				.select(TABLE_NAME, '*', { id: id })
				.then(rows => {
					resolve(rows[0]);
				})
				.catch(error => {
					reject({ message: 'document_findById', error: error });
				});
		});
	}

	return Controller;
};
