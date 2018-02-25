const IdAttribute = requireAppModule("angular/classes/id-attribute");
const IdAttributeItem = requireAppModule("angular/classes/id-attribute-item");

function GuestKeystoreCreateStep5Controller(
	$rootScope,
	$scope,
	$log,
	$q,
	$timeout,
	$state,
	$window,
	$stateParams,
	CommonService,
	ElectronService,
	ConfigFileService
) {
	"ngInject";

	$log.info("GuestKeystoreCreateStep5Controller", $stateParams);

	$scope.nextStep = event => {
		$state.go("guest.create.step-6");
	};

	$scope.backupKeystore = event => {
		let promise = ElectronService.openDirectorySelectDialog();
		promise.then(directoryPath => {
			if (directoryPath) {
				let store = ConfigFileService.getStore();
				let walletSettings = store.wallets[$rootScope.wallet.getPublicKeyHex()];

				ElectronService.moveFile(walletSettings.keystoreFilePath, directoryPath).then(
					() => {
						CommonService.showToast("success", "Saved!");
					}
				);
			}
		});
	};
}

module.exports = GuestKeystoreCreateStep5Controller;
