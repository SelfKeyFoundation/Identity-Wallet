'use strict';
function MemberMarketplaceController($rootScope, $scope, $state) {
	$scope.navigateToExchanges = () => {
		$state.go('member.marketplace.exchange-list');
	};
}
MemberMarketplaceController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceController;
