function GuestImportPrivateKeyController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService) {
    'ngInject'

    $log.info('GuestImportPrivateKeyController');
    $rootScope.wallet = null;

    $scope.selectKystoreJsonFile = (event) => {
        // TODO
        WalletService.importUsingKeystoreFileDialog().then((wallet) => {
            ConfigFileService.load().then((storeData) => {
                $log.info("storeData", storeData);
                $rootScope.wallet = wallet;
                $log.info(wallet);
            });
        });
    }

};

export default GuestImportPrivateKeyController;