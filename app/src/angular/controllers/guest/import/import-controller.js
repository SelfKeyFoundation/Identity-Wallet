function GuestImportWalletController($rootScope, $scope, $log, $state, SqlLiteService) {
    'ngInject'

    $log.info('GuestImportWalletController');

    $scope.selectedOption = "keystoreSelect";

    $scope.publicKeyList = SqlLiteService.getWalletPublicKeys();

    if ($scope.publicKeyList.length <= 0) {
        $scope.selectedOption = "keystoreImport";
        $state.go('guest.import.keystore', { type: 'import' });
    }
    $scope.options = [{
        title: 'Select Existing Address',
        subTitle: '(Keystore File)',
        icon: 'existing-keystore',
        value: 'keystoreSelect',
        disabled: false,
        conditionFn: () => {
            return $scope.publicKeyList.length > 0;
        }
    }, {
        title: 'Import New Address',
        subTitle: '(Keystore File)',
        icon: 'import-keystore',
        value: 'keystoreImport',
        disabled: false,
    }, {
        title: 'Ledger',
        icon: 'ledger',
        value: 'ledger',
        disabled: false
    }, {
        title: 'Private Key',
        icon: 'private-keys',
        value: 'privateKey',
        disabled: false
    }, {
        title: 'TREZOR',
        subTitle: '(Coming Soon)',
        icon: 'trezor',
        value: 'trezor',
        disabled: true
    }];


    
/*
    md-radio-group(md-no-ink, ng-model="selectedOption", ng-change="onRadioButtonChange($event)")
    md-radio-button(md-no-ink, value="keystoreImport") Import a new Keystore File (UTC)
    md-radio-button(md-no-ink, value="keystoreSelect", ng-if="publicKeyList.length > 0") Select an existing Keystore File (UTC)
    md-radio-button(md-no-ink, value="ledger") Ledger
    md-radio-button(md-no-ink, value="trezor", ng-disabled="true") TREZOR (Coming Soon)
    md-radio-button(md-no-ink, value="privateKey") Private Key*/



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
            case "ledger":
                $state.go('guest.import.ledger');
                break;
            default:
                $state.go('guest.import.keystore', { type: 'select' });
        }
    }
};

module.exports = GuestImportWalletController;
