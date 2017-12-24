import EthUnits from '../../classes/eth-units.js';
import EthUtils from '../../classes/eth-utils.js';
import Token from '../../classes/token.js';

function MemberLayoutController($rootScope, $scope, $log, $mdDialog, $mdSidenav, $interval, $timeout, ConfigFileService, ElectronService, ConfigStorageService, CommonService, EtherScanService, EtherUnitsService, TokenService, WalletService, MEWService, Web3Service) {
    'ngInject'

    $log.info('MemberLayoutController');

    $scope.openRightSidenav = () => {
        $mdSidenav('right').toggle().then(() => {
            $log.debug("toggle " + "right" + " is done");
        });
    }



    /*
    MEWService.getBalance($rootScope.wallet.getAddress()).then((resp)=>{
        console.log(resp, "????????????");
    }).catch((err)=>{
        console.log(err, "????????????");
    });

    MEWService.getEstimateGas($rootScope.wallet.getAddress(), 'b5f61a128af89ce992e96d71242297ad392a4e9c', 0.5).then((resp)=>{
        console.log("esitimated gas price", resp);
    });
    */






    return;
    // POLYGON FOR TESTING

    const TEST_PRIVATE_KEY = "f48194b05b5f927d392d6bd95da255f71ad486a6e5738c50fba472ad16b77fe1";
    const USER_TEST_PUBLIC_KEY = "0xD96969247B51187da3bf6418B3ED39304ae2006c"
    const CROWDSALE_CONTRACT_ADDRESS = "0x9f5a27e6d2323196e195743f28fbe817988dfdef";

    /*
    WalletService.importUsingKeystoreFileDialog().then((wallet)=>{
        $log.debug("wallet", wallet)
        WalletService.loadBalance();
    });
    */

    if (!ConfigStorageService.APP_OPEN_COUNT || ConfigStorageService.APP_OPEN_COUNT === 0) {
        var promise = CommonService.openUserAgreementDialog(true);
        promise.then(() => {
            if (!ConfigStorageService.USER_DOCUMENTS_STORAGE_PATH && ElectronService.ipcRenderer) {
                CommonService.openChooseUserDirectoryDialog(false);
            }
        });
    }

    ConfigStorageService.APP_OPEN_COUNT++;
    ConfigStorageService.setAppOpenCount(ConfigStorageService.APP_OPEN_COUNT);

    /*
    WalletService.loadGasPrice().then((data)=>{
        $log.debug(">>>>>>", data);
    });
    */

    // for testin.. use your keystore file path or use importUsingKeystoreFileDialog() method
    let prm = WalletService.importUsingKeystoreFilePath('/Users/giorgio/workspace/flagtheory/Identity-Wallet/release/test/UTC--2017-11-09T16:40:32.715Z--d96969247b51187da3bf6418b3ed39304ae2006c');
    //let prm = WalletService.importUsingKeystoreFilePath('/Users/giorgio/workspace/flagtheory/Identity-Wallet/release/UTC--2017-11-02T08:26:36.621Z--603fc6daa3dbb1e052180ec91854a7d6af873fdb');
    prm.then((wallet) => {
        $log.debug("keysrore read");

        EtherScanService.getBalance(wallet.getAddress()).then((data) => {
            console.log(">>>>>>>>", data);
        });

        return;

        // use your passphare instead of "passw"
        WalletService.unlockKeystoreObject("passw").then((wallet) => {
            $log.debug("keysrore unlock");
            // loaded - wallet.privateKey

            WalletService.loadTransactionCount().then((wallet) => {
                $log.debug("tx count load");

                // loaded wallet.nonceHex
                let tokenSignedTX = WalletService.generateTokenRawTransaction(
                    "0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb",   // address you want to send tokens
                    0,                                              // amount
                    17000000000,                                    // gas price
                    150000,                                         // gas limit
                    "KEY"                                           // token symbol (you can find symbols in ./wallet-web-app/src/store/tokens/eth-tokens.json)
                );
                $log.debug("tokenSignedTX TX:", tokenSignedTX);


                let ethSignedTXPromise = WalletService.generateEthRawTransaction(
                    "0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb",   // address you want to send tokens // crowdsale: 0x9f5a27e6d2323196e195743f28fbe817988dfdef
                    1,                                              // amount unit Eth
                    17000000000,                                    // gas price
                    210000,                                         // gas limit
                    null                                            // data
                );
                $log.debug("ethSignedTXPromise", ethSignedTXPromise);

            }).catch((error) => {
                $log.debug("e", error);
            });
        }).catch((error) => {
            $log.debug("111", error);
        });
    }).catch((error) => {
        $log.debug(error);
    });

    /**
     * 
     */
    let test = {
        message: ""
    }

    /*
    let testPromise1 = EtherScanService.getBalance('0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb');
    testPromise1.then((response) => {
        let a = EtherUnitsService.toEther(response.data.result, 'wei');
        $log.debug(a);
    });
    */

    /*
    let testPromise2 = ElectronService.generateEthereumWallet(
        'asdASD123!',
        '/Users/giorgio/workspace/flagtheory/Identity-Wallet/release/test'
    );
    testPromise2.then((result) => {
        $log.debug('generateEthereumWallet', result);
    });
    */

    /*
    let testPromise3 = ElectronService.importEthereumWallet(
        '603fc6daa3dbb1e052180ec91854a7d6af873fdb',
        'asdASD123!',
        '/Users/giorgio/workspace/flagtheory/Identity-Wallet/release'
    );
    testPromise3.then((keyObject) => {
        $log.debug('>>>>>', keyObject);
        ElectronService.unlockEthereumWallet(keyObject, 'asdASD123!').then((privateKey)=>{
            $log.debug(">>>>>>", privateKey);
            //7fa0a38e27d8f7bc90354a4fb4999aca2432376a41ab40e58d7ad843fe804b3e
            //51c394b440c103033af867598536300fbab06ac286dbe9ed37066d7e69e3f040
        });
    });
    */

    /*
    EtherScanService.sendRawTransaction('0xf86b048505b13073a482520994e4bd7ab5bb01a284d6372e2408dbecf52aaeb01087038d7ea4c680008026a0ddef762e8fe0df02883c3969632610254d81f0b5ee9a19a2924ca1459ea8149ca029d36c63369f1768959bb6f2b51e9c95cc89ae33321d20f3c1a991fe07d69aef').then((data) => {
        $log.debug("data", data);
    }).catch((error) => {
        $log.debug("error", error);
    });

    EtherScanService.getTransaction('0x4aeca8f6381caa7413df85978ad6e1e95f21a2d8f8edf3206994e715900bda56').then((data) => {
        $log.debug("data", data);
    }).catch((error) => {
        $log.debug("error", error);
    });
    */



};

export default MemberLayoutController;