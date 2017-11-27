function GuestLoadingController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService) {
    'ngInject'

    $log.info('GuestLoadingController');

    // 1: check setting files exists
    //    (a): create new & redirect to welcome view
    //    (b): check if wallet keystore exists
    //         (a) if exists redirect to unlock view
    //         (b) if not redirect to welcome
    $rootScope.loadingPromise = ConfigFileService.init();
    $rootScope.loadingPromise.then((storeData) => {
        $log.info("storeData", storeData);

        let walletsMetaData = ConfigFileService.getWalletsMetaData();
        $log.info("keys", ConfigFileService.getWalletsMetaData());

        if (walletsMetaData.length > 0) {
            let wmd = walletsMetaData[0];
            console.log("???", wmd);

            WalletService.importUsingKeystoreFilePath(wmd.keystoreFilePath).then((wallet) => {
                $rootScope.wallet = wallet;
                // go to unlock state
                $state.go('guest.process.unlock-keystore');
            }).catch((error)=>{
                console.log(">>>>>>>>", error);
            });
        } else {
            $state.go('guest.welcome');
        }

    }).catch((error) => {
        $log.error("error", error);
    });

    $log.info("loadingPromise", $rootScope.loadingPromise);
};

export default GuestLoadingController;