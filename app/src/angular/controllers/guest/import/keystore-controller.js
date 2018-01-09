function GuestImportKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, WalletService) {
    'ngInject'

    $log.info('GuestImportKeystoreController');
    $rootScope.wallet = null;

    $scope.type = $stateParams.type;


    $scope.publicKeyList = ConfigFileService.getWalletPublicKeys();

    $scope.userInput = {
        selectedPublicKey: $scope.publicKeyList.length > 0 ? $scope.publicKeyList[0] : null,
        password: null
    }

    $scope.selectKystoreFile = (event) => {
        WalletService.importUsingKeystoreFileDialog().then((wallet) => {
            ConfigFileService.load().then((storeData) => {
                $rootScope.wallet = wallet;
            });
        });
    }

};

export default GuestImportKeystoreController;