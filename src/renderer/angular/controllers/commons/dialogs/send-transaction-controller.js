'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('SendTransactionController');

// const EthUnits = require('../../../classes/eth-units');

function SendTransactionController($scope, $state, $stateParams, CONFIG, RPCService) {
	'ngInject';

	let args = {
		allowSelectERC20Token: $stateParams.allowSelectERC20Token
	};
	$scope.symbol = $stateParams.symbol;

	log.info('SendTransactionController');
	log.debug('SendTransactionController %j %j', args, CONFIG);

	$scope.cancel = event => {
		// cancelEstimatedGasCheck(); TODO tato
		// cancelTxCheck(); TODO tato

		if (!$scope.symbol) {
			$state.go('member.dashboard.main');
		} else {
			$state.go('member.wallet.manage-token', { id: $scope.symbol });
		}
	};

	$scope.send = () => {
		$scope.address = '';
	};

	$scope.onAddressFieldChange = value => {
		$scope.address = value;
		// validation
	};
}

SendTransactionController.$inject = ['$scope', '$state', '$stateParams', 'CONFIG', 'RPCService'];

module.exports = SendTransactionController;
