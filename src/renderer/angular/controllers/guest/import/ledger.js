'use strict';

const Wallet = require('../../../classes/wallet');

function GuestImportLedgerController(
	$rootScope,
	$scope,
	$log,
	$q,
	$timeout,
	$state,
	RPCService,
	CommonService,
	SqlLiteService
) {
	'ngInject';

	$log.info('GuestImportLedgerController');
}
GuestImportLedgerController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$q',
	'$timeout',
	'$state',
	'RPCService',
	'CommonService',
	'SqlLiteService'
];
module.exports = GuestImportLedgerController;
