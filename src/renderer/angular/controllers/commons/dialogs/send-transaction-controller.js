'use strict';
const { Logger } = require('common/logger/logger');
const store = require('renderer/react/common/store').default;
const { transactionOperations } = require('common/transaction');

const log = new Logger('SendTransactionController');

// const EthUnits = require('../../../classes/eth-units');

function SendTransactionController($scope, $rootScope, $mdDialog, $state, $stateParams) {
	'ngInject';

	$scope.symbol = $stateParams.symbol;
	let { profile, publicKey } = $rootScope.wallet;

	log.info('SendTransactionController');

	$scope.cancel = event => {
		if (!$scope.symbol) {
			$state.go('member.dashboard.main');
		} else {
			$state.go('member.wallet.manage-token', { id: $scope.symbol });
		}
	};

	$scope.navigateToTransactionProgress = () => {
		$state.go('member.wallet.send-transaction.progress', { symbol: $scope.symbol });
	};

	$scope.navigateToTransactionNoGasError = () => {
		$state.go('member.wallet.send-transaction.no-gas', { publicKey, symbol: $scope.symbol });
	};

	$scope.navigateToTransactionError = message => {
		$state.go('member.wallet.send-transaction.error', {
			message,
			publicKey,
			symbol: $scope.symbol
		});
	};

	$scope.showConfirmTransactionInfoModal = () => {
		$rootScope.openConfirmHardwareWalletTxInfoWindow(profile);
	};

	$scope.closeModal = () => {
		$mdDialog.cancel();
	};

	let ledgerStatusCodesMap = {
		27013: 'denied',
		26625: 'locked'
	};

	let processLedgerErr = err => {
		let message = ledgerStatusCodesMap[err.statusCode] || err.message || '';
		switch (message.toLowerCase()) {
			case 'timeout':
				$rootScope.openHardwareWalletTimedOutWindow(profile);
				break;
			case 'denied':
				$rootScope.openRejectHardwareWalletTxWarningDialog(profile);
				break;
			case 'locked':
				$rootScope.openUnlockLedgerInfoWindow();
				break;
			default:
				let isSendingTxFailure = true;
				$rootScope.openConnectingToLedgerDialog(isSendingTxFailure);
		}
	};

	let processTrezorErr = err => {
		let message = err.message || err.code || '';
		switch (message) {
			case 'Timeout':
				$rootScope.openHardwareWalletTimedOutWindow(profile);
				break;
			case 'Failure_ActionCancelled':
				$rootScope.openRejectHardwareWalletTxWarningDialog(profile);
				break;
			case 'Failure_PinCancelled':
				break;
			case 'Failure_PinInvalid':
				$scope.startSend();
				$rootScope.incorrectTrezorPinEntered = true;
				break;
			default:
				let isSendingTxFailure = true;
				$rootScope.openConnectingToTrezorDialog(isSendingTxFailure);
		}
	};

	$scope.startSend = async () => {
		if ($rootScope.wallet.isHardwareWallet) {
			$scope.showConfirmTransactionInfoModal();
		}
		try {
			await store.dispatch(transactionOperations.startSend());
		} catch (error) {
			$scope.onSignTxFailure(error);
		}

		if (profile === 'ledger') {
			$scope.closeModal();
		}
	};

	$scope.onSignTxFailure = err => {
		if (profile === 'ledger') {
			processLedgerErr(err);
		}
		if (profile === 'trezor') {
			processTrezorErr(err);
		}
	};

	let deregisterTxSignSuccessEvent = $rootScope.$on('TREZOR_SIGN_SUCCESS', event => {
		$mdDialog.cancel();
	});

	let deregisterTxSignFailureEvent = $rootScope.$on('TREZOR_SIGN_FAILURE', (event, err) => {
		$mdDialog.cancel();
		$scope.onSignTxFailure(err);
	});

	let deregisterTxSignEvent = $rootScope.$on('tx-sign:retry', () => {
		$mdDialog.cancel();
		$scope.startSend();
	});

	$scope.$on('$destroy', () => {
		if (deregisterTxSignSuccessEvent) deregisterTxSignSuccessEvent();
		if (deregisterTxSignFailureEvent) deregisterTxSignFailureEvent();
		if (deregisterTxSignEvent) deregisterTxSignEvent();
	});
}

SendTransactionController.$inject = ['$scope', '$rootScope', '$mdDialog', '$state', '$stateParams'];

module.exports = SendTransactionController;
