'use strict';

function GuestLayoutController($scope, $log, $state) {
	'ngInject';

	$log.info('GuestLayoutController');

	$scope.cancel = function(event) {
		$state.go('guest.welcome');
	};
}
GuestLayoutController.$inject = ['$scope', '$log', '$state'];
module.exports = GuestLayoutController;
