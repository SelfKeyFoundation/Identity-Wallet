'use strict';
function MemberMarketplaceUnlockController($rootScope, $scope, $state) {
	$scope.close = () => {
		$state.go('member.marketplace.exchange-item', { data: { name: $state.params.data.name } });
	};
	$scope.navigateToTransactionProgress = () => {
		$state.go('member.marketplace.progress', {
			data: { name: $state.params.data.name }
		});
	};
}
MemberMarketplaceUnlockController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceUnlockController;
