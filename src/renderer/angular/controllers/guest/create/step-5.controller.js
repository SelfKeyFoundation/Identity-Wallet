'use strict';

function GuestKeystoreCreateStep5Controller(
	$rootScope,
	$scope,
	$log,
	$state,
	$stateParams,
	$mdDialog,
	$timeout,
	SqlLiteService,
	RPCService,
	CommonService,
	SelfkeyService
) {
	'ngInject';

	$log.info('GuestKeystoreCreateStep5Controller');

	$scope.createBasicId = event => {
		$state.go('guest.create.step-6');
	};

	$scope.cancel = event => {
		$state.go('member.dashboard.main');
	};

	$scope.importKycFile = event => {
		RPCService.makeCall('importKYCPackage', { walletId: $rootScope.wallet.id })
			.then(walletSetting => {
				//on cancel choose a file
				if (!walletSetting) {
					return;
				}
				SelfkeyService.triggerAirdrop(walletSetting.airDropCode).then(() => {
					SqlLiteService.removeAirdropCode(walletSetting);
				});

				$rootScope.wallet.loadIdAttributes().then(() => {
					$state.go('guest.create.step-6', { type: 'kyc_import' });
				});
			})
			.catch(error => {
				CommonService.showToast('error', 'Error');
			});
	};
}
GuestKeystoreCreateStep5Controller.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$state',
	'$stateParams',
	'$mdDialog',
	'$timeout',
	'SqlLiteService',
	'RPCService',
	'CommonService',
	'SelfkeyService'
];
module.exports = GuestKeystoreCreateStep5Controller;
