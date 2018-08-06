'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('GuestLayoutController');
function GuestLayoutController($scope, $state) {
	'ngInject';

	log.info('GuestLayoutController');

	$scope.cancel = function(event) {
		$state.go('guest.welcome');
	};
}
GuestLayoutController.$inject = ['$scope', '$state'];
module.exports = GuestLayoutController;
