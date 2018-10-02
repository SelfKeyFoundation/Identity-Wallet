'use strict';

function CertificateDialogController($rootScope, $scope, $mdDialog, RPCService) {
	'ngInject';

	$scope.text = 'Install the certificate';
	$scope.title = 'Certificate Install';

	$scope.accept = event => {
		RPCService.makeCustomCall('WSS_INSTALL', true);
		$mdDialog.hide();
	};

	$scope.cancel = event => {
		RPCService.makeCustomCall('WSS_INSTALL', false);
		$mdDialog.cancel();
	};
}
CertificateDialogController.$inject = ['$rootScope', '$scope', '$mdDialog', 'RPCService'];
module.exports = CertificateDialogController;
