'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('SendTransactionController');

// const EthUnits = require('../../../classes/eth-units');

function SendTransactionController($scope, $state, $stateParams) {
	'ngInject';

	$scope.symbol = $stateParams.symbol;

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
}

SendTransactionController.$inject = ['$scope', '$state', '$stateParams'];

module.exports = SendTransactionController;
