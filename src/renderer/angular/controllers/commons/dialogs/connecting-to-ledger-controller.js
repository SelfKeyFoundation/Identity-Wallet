'use strict';

function ConnectingToLedgerController($rootScope, $scope, $log, $mdDialog, LedgerService) {
	'ngInject';

	$scope.connectionFailed = false;
	$scope.isConnecting = true;
	const ACCOUNTS_QUANTITY_PER_PAGE = 6;

	$scope.cancelConectToLedger = () => {
		$mdDialog.cancel();
	};

	$scope.closeDialog = () => {
		$mdDialog.cancel();
	};

	const onError = () => {
		$scope.isConnecting = false;
		$scope.connectionFailed = true;
	};

	$scope.getAccounts = () => {
		$scope.connectionFailed = false;
		$scope.isConnecting = true;
		LedgerService.getAccountsWithBalances({ start: 0, quantity: ACCOUNTS_QUANTITY_PER_PAGE })
			.then(accounts => {
				if (!accounts || accounts.length == 0) {
					onError();
					return;
				}

				$scope.closeDialog();
				$rootScope.openChooseLedgerAddressDialog(accounts, ACCOUNTS_QUANTITY_PER_PAGE);
			})
			.catch(err => {
				onError();
			});
	};

	$scope.getAccounts();
}

ConnectingToLedgerController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$mdDialog',
	'LedgerService'
];
module.exports = ConnectingToLedgerController;
