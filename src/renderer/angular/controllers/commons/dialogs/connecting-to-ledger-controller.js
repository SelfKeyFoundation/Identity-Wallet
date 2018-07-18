'use strict';
const { Logger } = require('common/logger');
const log = new Logger('conn-to-ledger-ctl');

function ConnectingToLedgerController(
	$rootScope,
	$scope,
	$mdDialog,
	LedgerService,
	isSendingTxFealure
) {
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
				if (!accounts || accounts.length === 0) {
					onError();
					return;
				}

				$scope.closeDialog();
				$rootScope.openChooseLedgerAddressDialog(accounts, ACCOUNTS_QUANTITY_PER_PAGE);
			})
			.catch(err => {
				log.error(err.message);
				onError();
			});
	};

	if (isSendingTxFealure) {
		$scope.connectionFailed = true;
		$scope.isConnecting = false;
	} else {
		$scope.getAccounts();
	}

	$scope.tryAgain = event => {
		if (isSendingTxFealure) {
			$rootScope.broadcastRetryToSign(event);
		} else {
			$scope.getAccounts();
		}
	};
}

ConnectingToLedgerController.$inject = [
	'$rootScope',
	'$scope',
	'$mdDialog',
	'LedgerService',
	'isSendingTxFealure'
];
module.exports = ConnectingToLedgerController;
