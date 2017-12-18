function GuestLoadingController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, Web3Service) {
    'ngInject'

    $log.info('GuestLoadingController');

    /*
    let txInfoPromise = Web3Service.getTransactionReceipt("0x34ede13d06b2b0b832e2c4463829c3f5614b7f09bf006faf93432850ee298ad1");
    txInfoPromise.then((txInfo)=>{
        console.log("txInfo", Number(txInfo.status));
    })
    */

    /*
    $timeout(()=>{
        $rootScope.rightSidenavControl.open();
    }, 2000);
    */

    /*
    Web3Service.getBalance('0x603fc6daa3dbb1e052180ec91854a7d6af873fdb').then((resp)=>{
        console.log("********", resp);
    }).catch((error)=>{
        console.log("********", err);
    })

    Web3Service.getGasPrice().then((resp)=>{
        console.log("********", resp);
    }).catch((error)=>{
        console.log("********", err);
    })
    */


/*
    let test = Web3Service.getEstimateGas("0x603fc6daa3dbb1e052180ec91854a7d6af873fdb", "0xb5f61a128af89ce992e96d71242297ad392a4e9c", 0.5);
    console.log(test);
    test.then((resp)=>{
        console.log(resp);
    }).catch((error)=>{
        console.log(error);
    });

    Web3Service.getBalance("0x603fc6daa3dbb1e052180ec91854a7d6af873fdb").then((resp)=>{
        console.log(resp);
    });

    Web3Service.getGasPrice().then((resp)=>{
        console.log(resp);
    });

    Web3Service.getTransactionCount("0x603fc6daa3dbb1e052180ec91854a7d6af873fdb").then((resp)=>{
        console.log(resp);
    });
   */ 

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