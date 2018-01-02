function GuestLoadingController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, Web3Service, SelfkeyService) {
    'ngInject'

    $log.info('GuestLoadingController');

    $rootScope.loadingPromise = ConfigFileService.init();
    $rootScope.loadingPromise.then((storeData) => {
        $log.info("storeData", storeData);

        let walletsMetaData = ConfigFileService.getWalletsMetaData();
        $log.info("keys", ConfigFileService.getWalletsMetaData());

        if (walletsMetaData.length > 0) {
            let wmd = walletsMetaData[0];
            WalletService.importUsingKeystoreFilePath(wmd.keystoreFilePath).then((wallet) => {
                $rootScope.wallet = wallet;
                // go to unlock state
                $state.go('guest.process.unlock-keystore');
            }).catch((error)=>{
                // TODO
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

    // TODO test
    //SelfkeyService.initKycProcess("0xf47863503959cdd0c8c457dcd218efb544f6870c", "g.maisuradze88@gmail.com");

    $log.info("loadingPromise", $rootScope.loadingPromise);
};

export default GuestLoadingController;