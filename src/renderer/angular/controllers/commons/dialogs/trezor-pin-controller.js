'use strict';

function TrezorPinController($rootScope, $scope, $mdDialog, HardwareWalletService) {
	'ngInject';

	$scope.pin = '';
	$scope.cancel = event => {
		HardwareWalletService.sendTrezorPin(new Error('pin_cancelled'));
		$mdDialog.cancel();
	};

	$scope.onPinBtn = digit => {
		$scope.pin += digit.toString();
	};

	$scope.clearPin = () => {
		$scope.pin = '';
	};

	$scope.sendPin = () => {
		if (!$scope.pin) {
			return;
		}
		HardwareWalletService.sendTrezorPin(null, $scope.pin);
	};
}

TrezorPinController.$inject = ['$rootScope', '$scope', '$mdDialog', 'HardwareWalletService'];
module.exports = TrezorPinController;
