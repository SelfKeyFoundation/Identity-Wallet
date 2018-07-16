'use strict';
const { Logger } = require('common/logger');
const log = new Logger('GuestKeystoreCreateStep4Controller');
function GuestKeystoreCreateStep4Controller($rootScope, $scope, $state, $window) {
	'ngInject';

	log.info('GuestKeystoreCreateStep4Controller');

	const SHOW_ICON = 'ic_visibility_black_24px';
	const HIDE_ICON = 'ic_visibility_off_black_24px';

	$scope.privateKey = '0x' + $rootScope.wallet.getPrivateKeyHex();
	$scope.visibilityIconName = SHOW_ICON;
	$scope.inputType = 'password';

	$scope.printPaperWallet = event => {
		$window.print();
	};

	$scope.nextStep = event => {
		// got to loading
		$state.go('guest.loading', { redirectTo: 'guest.create.step-5' });
	};

	$scope.togglePrivateKeyVisibility = () => {
		$scope.visibilityIconName = $scope.visibilityIconName === SHOW_ICON ? HIDE_ICON : SHOW_ICON;
		$scope.inputType = $scope.visibilityIconName === SHOW_ICON ? 'password' : 'text';
	};
}
GuestKeystoreCreateStep4Controller.$inject = ['$rootScope', '$scope', '$state', '$window'];
module.exports = GuestKeystoreCreateStep4Controller;
