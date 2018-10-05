const { Logger } = require('common/logger/logger');
const log = new Logger('ManageTokenController');
function ManageTokenController(
	$rootScope,
	$scope,
	$state,
	$mdDialog,
	$stateParams,
	Web3Service,
	CommonService,
	SqlLiteService
) {
	'ngInject';

	log.debug('ManageTokenController, %j', $stateParams);

	let temporaryMap = {
		[$rootScope.PRIMARY_TOKEN]: 'SelfKey',
		ETH: 'Ethereum'
	};

	$scope.selectedToken = $rootScope.wallet.tokens[$stateParams.id.toUpperCase()];

	$scope.publicKeyHex = '0x' + $rootScope.wallet.getPublicKeyHex();
	$scope.symbol = $stateParams.id.toUpperCase();
	$scope.originalSymbol = $stateParams.id;
	$scope.name = temporaryMap[$scope.symbol];

	/**
	 *
	 */
	prepareBalance();

	/**
	 *
	 */
	function prepareBalance() {
		if ($scope.symbol === 'ETH') {
			// ETHER
			$scope.balance = Intl.NumberFormat('en-US').format(
				$rootScope.wallet.balanceEth.toFixed(2)
			);
			$scope.balanceUsd = Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format($rootScope.wallet.balanceInUsd);
		} else {
			// TOKEN
			$scope.balance = Intl.NumberFormat('en-US').format(
				Number($scope.selectedToken.getBalanceDecimal()).toFixed(2)
			);
			$scope.balanceUsd = Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format($scope.selectedToken.balanceInUsd);
		}
	}

	$scope.goToDashboard = () => {
		$state.go('member.dashboard.main');
	};

	/**
	 * events
	 */
	$rootScope.$on('balance:change', (event, symbol, balance, balanceInUsd) => {
		log.debug('balance:change %s %f %f', symbol, balance, balanceInUsd);
		prepareBalance();
	});
}
ManageTokenController.$inject = [
	'$rootScope',
	'$scope',
	'$state',
	'$mdDialog',
	'$stateParams',
	'Web3Service',
	'CommonService',
	'SqlLiteService'
];
module.exports = ManageTokenController;
