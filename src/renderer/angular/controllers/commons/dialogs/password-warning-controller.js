'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('PasswordWarningDialogController');

function PasswordWarningDialogController(
	$rootScope,
	$scope,
	$q,
	$mdDialog,
	$state,
	RPCService,
	CommonService,
	SqlLiteService
) {
	'ngInject';

	log.info('PasswordWarningDialogController');

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
	'$q',
	'$mdDialog',
	'$state',
	'RPCService',
	'CommonService',
	'SqlLiteService'
];
module.exports = PasswordWarningDialogController;
