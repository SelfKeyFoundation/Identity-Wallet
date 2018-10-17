'use strict';
function MemberMarketplaceUnlockProgressController($rootScope, $scope, $state) {
	$scope.close = () => {
		$state.go('member.marketplace.exchange-item', { data: { name: $state.params.data.name } });
	};
}
MemberMarketplaceUnlockProgressController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberMarketplaceUnlockProgressController;
