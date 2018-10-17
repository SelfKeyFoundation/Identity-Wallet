'use strict';

function CertificateDialogController($rootScope, $scope, $mdDialog, RPCService, msgType) {
	'ngInject';

	if (msgType === 'install') {
		$scope.title = 'Certificate Install';
		$scope.text =
			'The SelfKey Identity Wallet needs to install a certificate to provide a secure websocket connection between the SelfKey Connect Browser Extension and the SelfKey Identiy Wallet.  You may be prompted for you password in order to successfully install the certificate.';
	} else if (msgType === 'success') {
		$scope.title = 'Certificate Installation Successful';
		$scope.text =
			'The certificate was successfully installed.  Please return to the SelfKey Connect browser extention to continue.';
	} else {
		$scope.title = 'Certificate Error';
		$scope.text = 'There was an error with the install process for the certificate';
	}

	$scope.accept = event => {
		RPCService.makeCustomCall('WSS_INSTALL', true);
		$mdDialog.hide();
	};

	$scope.cancel = event => {
		RPCService.makeCustomCall('WSS_INSTALL', false);
		$mdDialog.cancel();
	};
}
CertificateDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$mdDialog',
	'RPCService',
	'msgType'
];

module.exports = CertificateDialogController;
