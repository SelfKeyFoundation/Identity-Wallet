function GuestLoadingController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, WalletService, Web3Service, SelfkeyService) {
    'ngInject'

    $log.info('GuestLoadingController');

    switch($stateParams.redirectTo){
        case 'member.setup.view-keystore':
            $state.go($stateParams.redirectTo);
            $scope.subHeader = "Getting Ready"
        break;
        default:
            init ();
    }

    function init () {
        $rootScope.loadingPromise = ConfigFileService.init();
        $rootScope.loadingPromise.then((storeData) => {
            $log.info("storeData", storeData);

            let publicKeys = ConfigFileService.getPublicKeys('ks');

            if (publicKeys.length > 0) {

                let w = storeData.wallets[publicKeys[0]];

                WalletService.importUsingKeystoreFilePath(w.keystoreFilePath).then((wallet) => {
                    $rootScope.wallet = wallet;
                    // go to unlock state
                    //$state.go('guest.process.unlock-keystore');
                    $state.go('guest.welcome');
                }).catch((error)=>{
                    $log.error("error", error);
                });
            } else {
                $state.go('guest.welcome');
            }

            /**
             *
             */
            $rootScope.checkTermsAndConditions();
        }).catch((error) => {
            $log.error("error", error);
        });
    }
};

export default GuestLoadingController;