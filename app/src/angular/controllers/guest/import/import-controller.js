function GuestImportWalletController(
	$rootScope,
	$scope,
	$log,
	$q,
	$timeout,
	$state,
	ConfigFileService,
	WalletService
) {
	"ngInject";

    $log.info('GuestImportWalletController');

	$scope.selectedOption = "keystoreSelect";

    if ($scope.publicKeyList.length <= 0) {
        $scope.selectedOption = "keystoreImport";
        $state.go('guest.import.keystore', { type: 'import' });
    }

    $scope.onRadioButtonChange = (event) => {
        $log.info("onRadioButtonChange", $scope.selectedOption)

        switch ($scope.selectedOption) {
            case "keystoreSelect":
                $state.go('guest.import.keystore', { type: 'select' });
                break;
            case "keystoreImport":
                $state.go('guest.import.keystore', { type: 'import' });
                break;
            case "privateKey":
                $state.go('guest.import.private-key');
                break;
            default:
                $state.go('guest.import.keystore', { type: 'select' });
        }
    }

	$scope.onRadioButtonChange = event => {
		$log.info("onRadioButtonChange", $scope.selectedOption);
    }
}

module.exports = GuestImportWalletController;
