'use strict';
const { Logger } = require('common/logger');

const log = new Logger('ExchangeItemController');

function MemberMarketplaceExchangeItemController($rootScope, $scope, $state) {
	'ngInject';
	$scope.name = $state.params.data.name;

	$scope.navigateToUnlock = (hasBalance = false) => {
		log.info(`unlocking marketplace ${$scope.name}, hasBalance: ${hasBalance}`);
		if (!hasBalance) {
			return $state.go('member.marketplace.no-balance', { data: { name: $scope.name } });
		}
		$state.go('member.marketplace.unlock', { data: { name: $scope.name } });
	};

	$scope.navigateToReturn = () => {
		log.info(`returning stake for  marketplace ${$scope.name}`);
		$state.go('member.marketplace.return', { data: { name: $scope.name } });
	};

	$scope.navigateToExchangeList = () => {
		$state.go('member.marketplace.exchange-list');
	};
}
MemberMarketplaceExchangeItemController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceExchangeItemController;
