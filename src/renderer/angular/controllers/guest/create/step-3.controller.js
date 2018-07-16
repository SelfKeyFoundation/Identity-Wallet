'use strict';
const { Logger } = require('common/logger');
const log = new Logger('GuestKeystoreCreateStep2Controller');
function GuestKeystoreCreateStep3Controller(
	$rootScope,
	$scope,
	$state,
	$stateParams,
	RPCService,
	CommonService
) {
	'ngInject';

	log.debug('GuestKeystoreCreateStep3Controller');

	$scope.publicKey = '0x' + $rootScope.wallet.publicKeyHex;

	$scope.nextStep = event => {
		$state.go('guest.create.step-4');
	};

	$scope.backupKeystore = event => {
		let promise = RPCService.makeCall('openDirectorySelectDialog', null);
		promise.then(targetDirectory => {
			if (targetDirectory) {
				RPCService.makeCall('getWalletsDirectoryPath', null).then(walletsDirectoryPath => {
					let walletPath =
						walletsDirectoryPath + '/' + $rootScope.wallet.keystoreFilePath;
					RPCService.makeCall('moveFile', {
						src: walletPath,
						dest: targetDirectory,
						copy: true
					}).then(() => {
						CommonService.showToast('success', 'Saved!');
					});
				});
			}
		});
	};
}
GuestKeystoreCreateStep3Controller.$inject = [
	'$rootScope',
	'$scope',
	'$state',
	'$stateParams',
	'RPCService',
	'CommonService'
];
module.exports = GuestKeystoreCreateStep3Controller;
