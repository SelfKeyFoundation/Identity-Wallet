'use strict';
function MemberMarketplaceReturnController($rootScope, $scope, $state) {
	$scope.close = () => {
		$state.go('member.marketplace.exchange-item', { data: { name: $state.params.data.name } });
	};
	$scope.navigateToTransactionProgress = () => {
		$state.go('member.marketplace.progress', {
			data: { name: $state.params.data.name }
		});
	};
}
MemberMarketplaceReturnController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceReturnController;
