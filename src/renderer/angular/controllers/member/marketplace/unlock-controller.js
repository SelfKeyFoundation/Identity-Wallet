'use strict';
function MemberMarketplaceUnlockController($rootScope, $scope, $state) {
	$scope.close = () => {
		$state.go('member.marketplace.exchange-item', { data: { name: $state.params.data.name } });
	};
	$scope.confirm = (...args) => {
		console.log('XXX transaction confirmed', args);
	};
}
MemberMarketplaceUnlockController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceUnlockController;
