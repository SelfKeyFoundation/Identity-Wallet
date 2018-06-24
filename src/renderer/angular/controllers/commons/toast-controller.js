'use strict';

function ToastController($rootScope, $scope, $log, message, type, headerText) {
	'ngInject';

	$log.info('ToastController', message);

	$scope.type = type;
	$scope.message = message;
	$scope.headerText = headerText;

	$scope.typeClass = 'md-toast-' + type;
	$scope.icon = type === 'error' ? 'info-icon' : 'info-icon';
}
ToastController.$inject = ['$rootScope', '$scope', '$log', 'message', 'type', 'headerText'];
module.exports = ToastController;
