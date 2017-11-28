function GuestCreateKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, ElectronService) {
    'ngInject'

    $log.info('GuestCreateKeystoreController');

    $rootScope.wallet = null;
    $scope.isGenerated = false;
    $scope.storeData = null;
    $scope.userInput = {
        password: ''
    };

    $scope.createKeystore = (event) => {
        console.log($scope.userInput.password);
        if(!$scope.userInput.password) return;
        let promise = WalletService.createKeystoreFile($scope.userInput.password);
        promise.then((wallet) => {
            ConfigFileService.load().then((storeData) => {
                $scope.storeData = storeData;
                $rootScope.wallet = wallet;
                $scope.isGenerated = true;

                $log.info("storeData", $scope.storeData);
                $log.info("wallet", $rootScope.wallet);
            });
        });
    }

    $scope.backupKeystore = (event) => {
        let promise = ElectronService.openDirectorySelectDialog();
        promise.then((directoryPath) => {
            if (directoryPath) {
                let walletSettings = $scope.storeData.wallets[$rootScope.wallet.getAddress()];
                ElectronService.moveFile(walletSettings.keystoreFilePath, directoryPath);
            }
        });
    }
};

export default GuestCreateKeystoreController;