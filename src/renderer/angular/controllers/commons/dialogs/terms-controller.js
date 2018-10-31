'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('TermsDialogController');
function TermsDialogController($rootScope, $scope, $mdDialog, SqlLiteService, $timeout, $window) {
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
		isSet: true
	};

	const setAnalytics = agreed => {
		if (agreed) {
			const matomo = $window.document.createElement('script');
			matomo.src = $window.staticPath + 'assets/libs/matomo.js';
			$window.document.body.appendChild(matomo);
		}
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
		setAnalytics($scope.crashReportAgreement.isSet);
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
	'$mdDialog',
	'SqlLiteService',
	'$timeout',
	'$window'
];
module.exports = TermsDialogController;
