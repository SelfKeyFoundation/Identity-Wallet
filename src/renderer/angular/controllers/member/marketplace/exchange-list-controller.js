'use strict';
function MemberMarketplaceExchangeListController($rootScope, $scope, $state) {
	'ngInject';

	$scope.navigateToDetails = name => {
		$state.go('member.marketplace.exchange-item', { data: { name } });
	};

	$scope.navigateToMarketplace = () => {
		$state.go('member.marketplace.main');
	};
}
MemberMarketplaceExchangeListController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceExchangeListController;
