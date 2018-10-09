'use strict';

function TrezorPassphraseController($rootScope, $scope, $mdDialog, HardwareWalletService) {
	'ngInject';

	$scope.inputType = 'password';
	$scope.toogleInputType = () => {
		$scope.inputType = $scope.inputType === 'password' ? 'text' : 'password';
	};

	$scope.cancel = () => {
		HardwareWalletService.sendTrezorPassphrase(new Error('passphrase_cancelled'));
		$mdDialog.cancel();
	};

	$scope.passphrase = '';
	$scope.passphraseRepeated = '';
	$scope.error = '';

	$scope.sendPassphrase = () => {
		if ($scope.passphrase !== $scope.passphraseRepeated) {
			$scope.error = 'Passphrases do not match.';
			return;
		}
		HardwareWalletService.sendTrezorPassphrase(null, $scope.passphrase);

		// passphrase does't throw any error, so closo modal
		$mdDialog.cancel();
	};
}

TrezorPassphraseController.$inject = ['$rootScope', '$scope', '$mdDialog', 'HardwareWalletService'];
module.exports = TrezorPassphraseController;
