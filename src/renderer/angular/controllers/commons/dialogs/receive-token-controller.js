'use strict';

function ReceiveTokenDialogController($rootScope, $scope, $log, $q, $mdDialog, $window, args) {
	'ngInject';

	$scope.symbol = args.symbol; // key
	$scope.publicKeyHex = args.publicKeyHex; // 0x4ac0d9ebd28118cab68a64ad8eb8c07c0120ebf8

	$scope.print = event => {
		$window.print();
	};

	$scope.cancel = event => {
		$mdDialog.cancel();
	};
}
ReceiveTokenDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$q',
	'$mdDialog',
	'$window',
	'args'
];
module.exports = ReceiveTokenDialogController;
