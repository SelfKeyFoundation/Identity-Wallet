'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('SendTransactionController');

// const EthUnits = require('../../../classes/eth-units');

function SendTransactionController($scope, $rootScope, $mdDialog, $state, $stateParams) {
	'ngInject';

	$scope.symbol = $stateParams.symbol;
	let profile = $rootScope.wallet.profile;

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

	$scope.showConfirmTransactionInfoModal = () => {
		$rootScope.openConfirmHardwareWalletTxInfoWindow($rootScope.wallet.profile);
	};

	$scope.closeModal = () => {
		console.log('close action is invoked');
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

	$scope.onSignTxFailure = err => {
		console.log('error in controller', err);
		if (profile === 'ledger') {
			processLedgerErr(err);
		}
	};
}

SendTransactionController.$inject = ['$scope', '$rootScope', '$mdDialog', '$state', '$stateParams'];

module.exports = SendTransactionController;
