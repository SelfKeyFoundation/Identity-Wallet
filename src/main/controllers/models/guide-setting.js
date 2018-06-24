const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'guide_settings';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

	/**
	 *
	 */
	Controller.findAll = _findAll;
	Controller.updateById = _updateById;

	function _findAll() {
		return sqlLiteService.select(TABLE_NAME, '*');
	}

	function _updateById(id, data) {
		return sqlLiteService.update(TABLE_NAME, data, { id: id });
	}

	return Controller;
};
