'use strict';
const { Logger } = require('common/logger');
const log = new Logger('GuestImportLedgerController');
function GuestImportLedgerController(
	$rootScope,
	$scope,
	$q,
	$timeout,
	$state,
	RPCService,
	CommonService,
	SqlLiteService
) {
	'ngInject';

	log.info('GuestImportLedgerController');
}
GuestImportLedgerController.$inject = [
	'$rootScope',
	'$scope',
	'$q',
	'$timeout',
	'$state',
	'RPCService',
	'CommonService',
	'SqlLiteService'
];
module.exports = GuestImportLedgerController;
