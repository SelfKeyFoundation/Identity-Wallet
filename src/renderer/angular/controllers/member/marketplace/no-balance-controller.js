'use strict';
function MemberMarketplaceNoBalanceController($rootScope, $scope, $state) {
	$scope.close = () => {
		$state.go('member.marketplace.exchange-item', { data: { name: $state.params.data.name } });
	};
}
MemberMarketplaceNoBalanceController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceNoBalanceController;
