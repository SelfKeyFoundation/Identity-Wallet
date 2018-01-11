function GuestImportPrivateKeyController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService) {
    'ngInject'

    $log.info('GuestImportPrivateKeyController');
    $rootScope.wallet = null;

    $scope.userInput = {
        privateKey: null
    }

    $scope.$watch('userInput.privateKey', (newVal, oldVal) => {
        $scope.theForm.privateKey.$setValidity("badPrivateKey", true);
    });

    $scope.isUnlocking = false;

    $scope.unlock = (event, theForm) => {
        if(!theForm.$valid) return;

        $scope.isUnlocking = true;

        let privateKey = $scope.userInput.privateKey;
        if(!$scope.userInput.privateKey.startsWith("0x")){
            privateKey = "0x" + $scope.userInput.privateKey;
        }
        
        WalletService.unlockByPrivateKey(privateKey).then((wallet) => {
            ConfigFileService.load().then((storeData) => {
                $state.go('member.setup.view-keystore');
                
            });
        }).catch((error)=>{
            $log.error(error);
            theForm.privateKey.$setValidity("badPrivateKey", false);
            $scope.isUnlocking = false;
        });
    }

};

export default GuestImportPrivateKeyController;