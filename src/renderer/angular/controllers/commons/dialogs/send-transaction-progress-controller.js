'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('SendTransactionProgressController');

function SendTransactionProgressController($scope, $state, $stateParams) {
	'ngInject';

	$scope.symbol = $stateParams.symbol;

	$scope.cancel = event => {
		if (!$scope.symbol) {
			$state.go('member.dashboard.main');
		} else {
			$state.go('member.wallet.manage-token', { id: $scope.symbol });
		}
	};

	log.info('SendTransactionProgressController');
}

SendTransactionProgressController.$inject = ['$scope', '$state', '$stateParams'];

module.exports = SendTransactionProgressController;
