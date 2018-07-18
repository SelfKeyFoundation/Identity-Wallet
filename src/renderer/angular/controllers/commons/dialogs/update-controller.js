'use strict';
const { Logger } = require('common/logger');
const log = new Logger('UpdateDialogController');
function UpdateDialogController($rootScope, $scope, $q, $mdDialog, releaseName) {
	'ngInject';

	log.info('UpdateDialogController, %s', releaseName);
	$scope.updatePromise = null;

	$scope.releaseName = releaseName;

	$scope.close = event => {
		$mdDialog.hide();
	};

	$scope.update = event => {
		/*
        $scope.updatePromise = ElectronService.installUpdate();
        $scope.updatePromise.then(() => {
            $mdDialog.hide();
        });
        */
	};
}
UpdateDialogController.$inject = ['$rootScope', '$scope', '$q', '$mdDialog', 'releaseName'];
module.exports = UpdateDialogController;
