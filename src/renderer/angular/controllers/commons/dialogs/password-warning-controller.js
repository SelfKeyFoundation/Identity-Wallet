'use strict';

const Wallet = require('../../../classes/wallet');

function PasswordWarningDialogController(
	$rootScope,
	$scope,
	$log,
	$q,
	$mdDialog,
	$state,
	RPCService,
	CommonService,
	SqlLiteService
) {
	'ngInject';

	$log.info('PasswordWarningDialogController');

	$scope.cancel = event => {
		$mdDialog.cancel();
	};

	$scope.accept = event => {
		$mdDialog.hide();
	};
}
PasswordWarningDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$q',
	'$mdDialog',
	'$state',
	'RPCService',
	'CommonService',
	'SqlLiteService'
];
module.exports = PasswordWarningDialogController;
