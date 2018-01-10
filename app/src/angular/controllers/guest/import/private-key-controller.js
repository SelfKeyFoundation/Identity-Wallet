function GuestImportPrivateKeyController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService) {
    'ngInject'

    $log.info('GuestImportPrivateKeyController');
    $rootScope.wallet = null;

    $scope.userInput = {
        privateKey: null
    }

    $scope.unlock = (event, theForm) => {
        if(!theForm.$valid) return;

        let privateKey = "0x" + $scope.userInput.privateKey;
        WalletService.unlockByPrivateKey(privateKey).then((wallet) => {
            ConfigFileService.load().then((storeData) => {
                $state.go('member.setup.view-keystore');
            });
        }).catch((error)=>{
            $log.error(error);
            theForm.privateKey.$setValidity("required", true);
            theForm.privateKey.$setValidity("badPrivateKey", false);
        });
    }

};

export default GuestImportPrivateKeyController;