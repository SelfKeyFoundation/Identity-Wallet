'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('TermsDialogController');
function TermsDialogController($rootScope, $scope, $q, $mdDialog, SqlLiteService, $timeout) {
	'ngInject';

	log.info('TermsDialogController');
	$scope.isLoading = false;
	$scope.step = 'main';
	$scope.scrolledBottom = false;

	let guideSettings = SqlLiteService.getGuideSettings();

	$scope.changeStep = step => {
		$scope.step = step;
	};

	$scope.crashReportAgreement = {
		isSet: false
	};

	$scope.agree = event => {
		if (process.env.NODE_ENV !== 'test') {
			if (!$scope.scrolledBottom) {
				return;
			}
		}

		$scope.isLoading = true;
		guideSettings.termsAccepted = 1;
		guideSettings.crashReportAgreement = $scope.crashReportAgreement.isSet;
		let savePromise = SqlLiteService.saveGuideSettings(guideSettings);
		savePromise.then(() => {
			$scope.isLoading = false;
			$mdDialog.hide();
		});
	};

	$scope.notAgree = event => {
		$rootScope.closeApp();
	};

	$scope.scrollToEndContainer = direction => {
		if (direction === 'bottom') {
			$timeout(() => {
				$scope.scrolledBottom = true;
			});
		}
	};
}
TermsDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$q',
	'$mdDialog',
	'SqlLiteService',
	'$timeout'
];
module.exports = TermsDialogController;
