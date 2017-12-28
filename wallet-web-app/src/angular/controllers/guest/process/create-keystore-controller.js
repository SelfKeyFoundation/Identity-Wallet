function GuestCreateKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, ElectronService, CommonService) {
    'ngInject'

    $log.info('GuestCreateKeystoreController');

    let messagesContainer = angular.element(document.getElementById("message-container"));

    $rootScope.wallet = null;
    $scope.isGenerated = false;
    $scope.storeData = null;
    $scope.userInput = {
        password: ''
    };

    $scope.createKeystore = (event) => {
        
        if(!$scope.userInput.password) {
            CommonService.showMessage({
                container: messagesContainer,
                type: "info",
                message: "password is required",
                closeAfter: 1500,
                replace: true
            });
            return;
        }

        if($scope.userInput.password.length < 8) {
            CommonService.showMessage({
                container: messagesContainer,
                type: "info",
                message: "password length must be min 8 chars",
                closeAfter: 1500,
                replace: true
            });
            return;
        }

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