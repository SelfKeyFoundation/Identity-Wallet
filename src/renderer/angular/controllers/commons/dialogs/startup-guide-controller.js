'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('StartupGuideDialogController');
function StartupGuideDialogController($rootScope, $scope, $q, $mdDialog, $state, SqlLiteService) {
	'ngInject';

	log.info('StartupGuideDialogController');

	$scope.isLoading = false;

	let guideSettings = SqlLiteService.getGuideSettings();
	guideSettings.guideShown = 1;

	SqlLiteService.saveGuideSettings(guideSettings);

	$scope.cancel = event => {
		$mdDialog.cancel();
	};

	$scope.goToWalletSetup = () => {
		$scope.isLoading = true;
		$mdDialog.hide();
		$state.go('guest.welcome');
	};
}
StartupGuideDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$q',
	'$mdDialog',
	'$state',
	'SqlLiteService'
];
module.exports = StartupGuideDialogController;
