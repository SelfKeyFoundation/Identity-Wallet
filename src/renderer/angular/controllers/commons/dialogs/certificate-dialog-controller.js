'use strict';

function CertificateDialogController($rootScope, $scope, $mdDialog, RPCService) {
	'ngInject';

	$scope.text = 'Install the certificate';
	$scope.title = 'Certificate Install';

	$scope.accept = event => {
		console.log('ACEePt 1');
		$mdDialog.hide();
		RPCService.makeCall('WSS_INSTALL', true);
	};

	$scope.cancel = event => {
		RPCService.makeCall('WSS_INSTALL', false);
		$mdDialog.cancel();
	};
}
CertificateDialogController.$inject = ['$rootScope', '$scope', '$mdDialog', 'RPCService'];
module.exports = CertificateDialogController;
