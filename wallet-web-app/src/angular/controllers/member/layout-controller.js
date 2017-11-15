import EthUnits from '../../classes/eth-units.js';
import EthUtils from '../../classes/eth-utils.js';
import Token from '../../classes/token.js';

function MemberLayoutController($rootScope, $scope, $log, $mdDialog, $interval, $timeout,ElectronService, ConfigStorageService, CommonService, EtherScanService, EtherUnitsService, TokenService, WalletService) {
    'ngInject'

    $log.info('MemberLayoutController');

    // POLYGON FOR TESTING

    WalletService.importUsingKeystoreFileDialog().then((wallet)=>{
        console.log("wallet", wallet)
        WalletService.loadBalance();
    });

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
    let prm = ElectronService.importEthereumWallet('603fc6daa3dbb1e052180ec91854a7d6af873fdb', 'asdASD123!', '/Users/giorgio/workspace/flagtheory/Identity-Wallet/release');
    prm.then((resp) => {
        console.log(resp, "********");
    })
    */

    /*
    let testPromise1 = EtherScanService.getBalance('0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb');
    testPromise1.then((response) => {
        let a = EtherUnitsService.toEther(response.data.result, 'wei');
        console.log(a);
    });
    */

    /*
    let testPromise2 = ElectronService.generateEthereumWallet(
        'asdASD123!',
        '/Users/giorgio/workspace/flagtheory/Identity-Wallet/release/test'
    );
    testPromise2.then((result) => {
        console.log('generateEthereumWallet', result);
    });
    */

    /*
    let testPromise3 = ElectronService.importEthereumWallet(
        '603fc6daa3dbb1e052180ec91854a7d6af873fdb',
        'asdASD123!',
        '/Users/giorgio/workspace/flagtheory/Identity-Wallet/release'
    );
    testPromise3.then((keyObject) => {
        console.log('>>>>>', keyObject);
        ElectronService.unlockEthereumWallet(keyObject, 'asdASD123!').then((privateKey)=>{
            console.log(">>>>>>", privateKey);
            //7fa0a38e27d8f7bc90354a4fb4999aca2432376a41ab40e58d7ad843fe804b3e
            //51c394b440c103033af867598536300fbab06ac286dbe9ed37066d7e69e3f040
        });
    });
    */

    /*
    EtherScanService.sendRawTransaction('0xf86b048505b13073a482520994e4bd7ab5bb01a284d6372e2408dbecf52aaeb01087038d7ea4c680008026a0ddef762e8fe0df02883c3969632610254d81f0b5ee9a19a2924ca1459ea8149ca029d36c63369f1768959bb6f2b51e9c95cc89ae33321d20f3c1a991fe07d69aef').then((data) => {
        console.log("data", data);
    }).catch((error) => {
        console.log("error", error);
    });

    EtherScanService.getTransaction('0x4aeca8f6381caa7413df85978ad6e1e95f21a2d8f8edf3206994e715900bda56').then((data) => {
        console.log("data", data);
    }).catch((error) => {
        console.log("error", error);
    });
    */

    //console.log(Token.addContractToMap('key', {test: 1}), "TTTTTTTTTTT");

    const TEST_PRIVATE_KEY = "f48194b05b5f927d392d6bd95da255f71ad486a6e5738c50fba472ad16b77fe1";
    const USER_TEST_PUBLIC_KEY = "0xD96969247B51187da3bf6418B3ED39304ae2006c"
    const CROWDSALE_CONTRACT_ADDRESS = "0x9f5a27e6d2323196e195743f28fbe817988dfdef";

    TokenService.init(USER_TEST_PUBLIC_KEY);

    //$timeout(TokenService.loadAllbalance.bind(TokenService), 2000);
    //TokenService.loadAllbalance();

    TokenService.loadBalanceBySymbol("KEY");
    console.log("T O K E N", TokenService.getBySymbol("KEY"));

    
    //TokenService.loadBalanceBySymbol("ACC");
    

    EtherScanService.getTransactionCount(USER_TEST_PUBLIC_KEY).then((data) => {
        return;
        console.log("nonce", data);

        let value = EthUtils.sanitizeHex(EthUtils.decimalToHex(EthUnits.toWei(1)));
        let nonce = EthUtils.sanitizeHex(EthUtils.decimalToHex(12));
        let gasPrice = EthUtils.sanitizeHex(EthUtils.decimalToHex(100));
        let gasLimit = EthUtils.sanitizeHex(EthUtils.decimalToHex(210000));

        // gas price:  21000000000 WEI EthUtils('dec', 'wei', 21000000000)
        // gas limit: 

        console.log(">>>>>>>>>", value);
        /*
        let rawTxPromise = EtherScanService.generateRawTransaction(
            data.num,               // nonce
            100,                    // gasPrice
            21000,                  // gasLimit
            null,                   // toAddress
            value,                  // value
            null,                   // data
            TEST_PRIVATE_KEY,       // Private Key
            3,                      // chainId 1: mainnet, 3: ropsten
            {type: 'token', token: 'KEY'}
        );
        */

        let rawTxPromise = EtherScanService.generateRawTransaction(
            nonce,                          // nonce
            gasPrice,                       // gasPrice
            gasLimit,                       // gasLimit
            CROWDSALE_CONTRACT_ADDRESS,     // toAddress
            value,                          // value
            null,                           // data
            TEST_PRIVATE_KEY,               // Private Key
            3,                              // chainId 1: mainnet, 3: ropsten, 4: rinkeby
            {type: 'ether', token: 'KEY'}
        );
        
        rawTxPromise.then((data)=>{
            console.log("rawTxPromise", data.serializedTx);
            
            /*
            EtherScanService.sendRawTransaction(data.serializedTx).then((data) => {
                console.log("data", data);
            }).catch((error) => {
                console.log("error", error);
            });
            */
        });

    }).catch((error) => {
        console.log("error", error);
    });

    console.log(EthUnits.toWei(0.01), "?????????? HERE" ); // HERE!
    
};

export default MemberLayoutController;