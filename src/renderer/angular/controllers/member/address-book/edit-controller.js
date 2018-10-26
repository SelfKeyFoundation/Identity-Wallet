'use strict';
function AddressBookAddController($rootScope, $scope, $state) {
	$scope.id = $state.params.data.id;

	$scope.navigateBack = () => {
		$state.go('member.address-book.main');
	};
}
AddressBookAddController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = AddressBookAddController;
