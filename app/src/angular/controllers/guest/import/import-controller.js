function GuestImportWalletController($rootScope, $scope, $log, $state, SqlLiteService) {
    'ngInject'

    $log.info('GuestImportWalletController');

    $scope.selectedOption = "keystoreSelect";

    $scope.publicKeyList = SqlLiteService.getWalletPublicKeys();

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

};

module.exports = GuestImportWalletController;
