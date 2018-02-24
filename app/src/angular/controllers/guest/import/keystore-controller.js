function GuestImportKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ElectronService, ConfigFileService, WalletService, SqlLiteService) {
    'ngInject'

    $log.info('GuestImportKeystoreController');

    const wallets = SqlLiteService.getWallets();

    $scope.publicKeyList = SqlLiteService.getWalletPublicKeys();
    $scope.isUnlocking = false;
    $rootScope.wallet = null;
    $scope.type = $stateParams.type;



    $scope.userInput = {
        selectedPublicKey: $scope.publicKeyList.length > 0 ? $scope.publicKeyList[0] : null,
        selectedFilePath: null,
        password: null
    }

    $scope.selectKystoreFile = (event, theForm) => {
        let promise = ElectronService.openFileSelectDialog();
        promise.then((data) => {
            $scope.userInput.selectedFilePath = data.path;

            ConfigFileService.load().then(() => {
                $scope.publicKeyList = ConfigFileService.getPublicKeys('ks');
            });
        }).catch((error) => {

        });
    }

    $scope.unlock = (event, theForm) => {
        if (!theForm.$valid) return;

        let selectedFilePath = $scope.userInput.selectedFilePath;

        if ($scope.type === 'select') {
            if (wallets[$scope.userInput.selectedPublicKey]) {
                selectedFilePath = wallets[$scope.userInput.selectedPublicKey].keystoreFilePath;
            }
        }

        if (!selectedFilePath || !$scope.userInput.password) return;

        $scope.isUnlocking = true;
        let promise = WalletService.unlockByFilePath(wallets[$scope.userInput.selectedPublicKey].id, selectedFilePath, $scope.userInput.password);
        promise.then((wallet) => {
            $state.go('member.dashboard.main');
        }).catch((error) => {
            $log.error(error);

            $scope.isUnlocking = false;

            theForm.password.$setValidity("badKeystore", false);
            theForm.password.$setValidity("required", false);
        });
    }

};

module.exports = GuestImportKeystoreController;
