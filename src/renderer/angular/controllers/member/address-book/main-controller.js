'use strict';
function AddressBookMainController($rootScope, $scope, $state) {
	$scope.navigateToAdd = () => {
		$state.go('member.address-book.add');
	};

	$scope.navigateToEdit = id => {
		$state.go('member.address-book.edit', { data: { id: id } });
	};
}
AddressBookMainController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = AddressBookMainController;
