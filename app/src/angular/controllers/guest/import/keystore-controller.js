function GuestImportKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ElectronService, ConfigFileService, WalletService) {
    'ngInject'

    $log.info('GuestImportKeystoreController');
    
    $scope.isUnlocking = false;
    
    $rootScope.wallet = null;

    let store = ConfigFileService.getStore();

    $scope.type = $stateParams.type;

    $scope.publicKeyList = ConfigFileService.getWalletPublicKeys();

    $scope.userInput = {
        selectedPublicKey: $scope.publicKeyList.length > 0 ? $scope.publicKeyList[0] : null,
        selectedFilePath: null,
        password: null
    }

    $scope.selectKystoreFile = (event) => {
        let promise = ElectronService.openFileSelectDialog();
        promise.then((data) => {
            $scope.userInput.selectedFilePath = data.path;

            ConfigFileService.load().then(()=>{
                $scope.publicKeyList = ConfigFileService.getWalletPublicKeys();
            });
        }).catch((error) => {
            // todo
        });
    }

    $scope.unlock = (event) => {
        let selectedFilePath = $scope.userInput.selectedFilePath;

        if($scope.type === 'select'){
            if(store.wallets[$scope.userInput.selectedPublicKey].type === 'ks'){
                selectedFilePath = store.wallets[$scope.userInput.selectedPublicKey].keystoreFilePath;
            }   
        }

        if(!selectedFilePath || !$scope.userInput.password) return;

        $scope.isUnlocking = true;
        let promise = WalletService.unlockByFilePath(selectedFilePath, $scope.userInput.password);
        promise.then((wallet)=>{
            $state.go('member.setup.view-keystore');
            //$state.go('member.setup.main');
        }).catch((error)=>{
            $log.error(error);
            $scope.isUnlocking = false;
        });
    }

};

export default GuestImportKeystoreController;