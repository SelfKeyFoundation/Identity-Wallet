'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('ToastController');
function ToastController($rootScope, $scope, message, type, headerText) {
	'ngInject';

	log.info('ToastController %s', message);

	$scope.type = type;
	$scope.message = message;
	$scope.headerText = headerText;

	$scope.typeClass = 'md-toast-' + type;
	$scope.icon = type === 'error' ? 'info-icon' : 'info-icon';
}
ToastController.$inject = ['$rootScope', '$scope', 'message', 'type', 'headerText'];
module.exports = ToastController;
