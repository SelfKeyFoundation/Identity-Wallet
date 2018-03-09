function GuestImportPrivateKeyController($rootScope, $scope, $log, $q, $timeout, $state, CommonService, WalletService, SqlLiteService) {
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
        if (!theForm.$valid) return;

        $scope.isUnlocking = true;

        let privateKey = $scope.userInput.privateKey;
        if (!$scope.userInput.privateKey.startsWith("0x")) {
            privateKey = "0x" + $scope.userInput.privateKey;
        }

        WalletService.unlockByPrivateKey(privateKey).then((wallet, isReady) => {
            if(isReady){
                let initialPromises = [];
                initialPromises.push(wallet.loadIdAttributes());
                initialPromises.push(wallet.loadTokens());

                $q.all(initialPromises).then(()=>{
                    $state.go('member.dashboard.main');
                });
            }else{
                // TODO - create flow to fill basic id attributes
                CommonService.showToast('warning', 'missing implementation');
            }
        }).catch((error) => {
            $log.error(error);
            theForm.privateKey.$setValidity("badPrivateKey", false);
            $scope.isUnlocking = false;
        });
    }

};

module.exports = GuestImportPrivateKeyController;
