'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('SendTransactionFailureController');

function SendTransactionFailureController($scope, $state, $stateParams) {
	'ngInject';
	$scope.address = `0x${$stateParams.publicKey}`;
	$scope.message = $stateParams.message;
	let symbol = $stateParams.symbol;

	$scope.cancel = event => {
		if (symbol) {
			$state.go('member.wallet.manage-token', { id: symbol });
		} else {
			$state.go('member.dashboard.main');
		}
	};

	log.info('SendTransactionFailureController');
}

SendTransactionFailureController.$inject = ['$scope', '$state', '$stateParams'];

module.exports = SendTransactionFailureController;
