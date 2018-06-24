const electron = require('electron');
const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'app_settings';
	const Controller = function() {};

	let knex = sqlLiteService.knex;

	return Controller;
};
