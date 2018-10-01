'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('SendTransactionFailureController');

function SendTransactionFailureController($scope, $state, $stateParams) {
	'ngInject';
	$scope.address = `0x${$stateParams.publicKey}`;
	let symbol = $stateParams.symbol;

	$scope.cancel = event => {
		if (symbol) {
			$state.go('member.dashboard.main');
		} else {
			$state.go('member.wallet.manage-token', { id: symbol });
		}
	};

	log.info('SendTransactionFailureController');
}

SendTransactionFailureController.$inject = ['$scope', '$state', '$stateParams'];

module.exports = SendTransactionFailureController;
