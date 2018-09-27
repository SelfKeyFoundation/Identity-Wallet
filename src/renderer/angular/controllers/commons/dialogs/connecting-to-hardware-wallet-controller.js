'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('conn-to-hardware-wallet-ctl');
function ConnectingToHardwareWalletController(
	$rootScope,
	$scope,
	$mdDialog,
	HardwareWalletService,
	isSendingTxFailure,
	profile
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
		HardwareWalletService.getAccountsWithBalances({
			start: 0,
			quantity: ACCOUNTS_QUANTITY_PER_PAGE,
			profile,
			isInitial: true
		})
			.then(accounts => {
				if (!accounts || accounts.length === 0) {
					onError();
					return;
				}

				$scope.closeDialog();
				$rootScope.openChooseHardwareWalletAddressDialog(
					accounts,
					ACCOUNTS_QUANTITY_PER_PAGE,
					profile
				);
			})
			.catch(err => {
				log.error(err);
				if (err && err.message === 'TREZOR_BRIDGE_NOT_FOUND') {
					return $rootScope.openInstallTrezorBridgeWarning();
				}

				if (err && err.code === 'Failure_PinInvalid') {
					$rootScope.incorrectTrezorPinEntered = true;
					$scope.getAccounts();
					return;
				}
				onError();
			});
	};

	if (isSendingTxFailure) {
		$scope.connectionFailed = true;
		$scope.isConnecting = false;
	} else {
		$scope.getAccounts();
	}

	$scope.tryAgain = event => {
		if (isSendingTxFailure) {
			$rootScope.broadcastRetryToSign(event);
		} else {
			$scope.getAccounts();
		}
	};
}

ConnectingToHardwareWalletController.$inject = [
	'$rootScope',
	'$scope',
	'$mdDialog',
	'HardwareWalletService',
	'isSendingTxFailure',
	'profile'
];
module.exports = ConnectingToHardwareWalletController;
