'use strict';
function MemberMarketplaceExchangeItemController($rootScope, $scope, $state) {
	'ngInject';
	$scope.name = $state.params.data.name;

	$scope.navigateToUnlock = (hasBalance = false) => {
		if (!hasBalance) {
			$state.go('member.marketplace.no-balance', { data: { name: $scope.name } });
		}
	};

	$scope.navigateToExchangeList = () => {
		$state.go('member.marketplace.exchange-list');
	};
}
MemberMarketplaceExchangeItemController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceExchangeItemController;
