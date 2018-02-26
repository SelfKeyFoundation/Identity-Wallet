'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const EthUnits = requireAppModule('angular/classes/eth-units');
const EthUtils = requireAppModule('angular/classes/eth-utils');
const Token = requireAppModule('angular/classes/token');

function WalletService($rootScope, $log, $q, $timeout, EVENTS, RPCService, ElectronService, EtherScanService, Web3Service, CommonService, CONFIG) {
    'ngInject';

    $log.info('WalletService Initialized');

    let wallet = null;

    let isFirstLoad = true;

    // TODO moving to config
    const walletNamesMap = {
        '1': {},
        '3': {
            key: {
                //address: '0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb',
                name: 'SelfKey Token Sale'
            }
        }
    };

    /**
     *
     */
    class WalletService {

        constructor() {
            $rootScope.$on(EVENTS.NEW_TOKEN_ADDED, (event, token) => {
                this.loadTokenBalance(token.symbol);
            });
        }


        getWalletName(symbol, address) {
            if (!walletNamesMap[CONFIG.chainId]) return '';
            let symbolValue = walletNamesMap[CONFIG.chainId][symbol];
            if (symbolValue && symbolValue.address == address) {
                return symbolValue.name;
            }
            return '';
        }

        // ,,,
        createKeystoreFile(password, basicInfo) {
            let defer = $q.defer();

            let promise = RPCService.makeCall('generateEthereumWallet', { password: password, keyStoreSrc: null, basicInfo: basicInfo });
            promise.then((data) => {
                if (data && data.privateKey && data.publicKey) {
                    wallet = new Wallet(data.id, data.privateKey, data.publicKey);

                    //TokenService.init();

                    // Broadcast about changes
                    //$rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_LOADED, wallet);

                    defer.resolve(wallet);
                } else {
                    defer.reject("no data in resp");
                }
            }).catch((error) => {
                defer.reject(error);
            });

            return defer.promise;
        }

        importUsingKeystoreFileDialog() {
            let defer = $q.defer();

            let promise = ElectronService.openFileSelectDialog();

            promise.then((resp) => {
                this.importUsingKeystoreFilePath(resp.path).then((wallet) => {
                    defer.resolve(wallet);
                }).catch((error) => {
                    defer.reject("ERR_IMPORTING_KEYSTORE_FILE");
                });
            });

            return defer.promise;
        }

        importUsingKeystoreFilePath(filePath) {
            let defer = $q.defer();

            let promise = ElectronService.importEtherKeystoreFile(filePath);
            promise.then((data) => {
                wallet = new Wallet(data.privateKey, data.publicKey);

                //TokenService.init();

                $rootScope.wallet = wallet;

                // Broadcast about changes
                $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_LOADED, wallet);

                defer.resolve(wallet);
            }).catch((error) => {
                defer.reject(error);
            });

            return defer.promise;
        }

        unlockKeystoreObject(password) {
            let defer = $q.defer();

            let promise = ElectronService.unlockEtherKeystoreObject(wallet.keystoreObject, password);
            promise.then((privateKey) => {
                wallet.setPrivateKey(privateKey);

                // Broadcast about changes
                $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_UNLOCKED, wallet);
                this.loadBalance();

                defer.resolve(wallet);
            }).catch((error) => {
                defer.reject("ERR_UNLOCK_KEYSTORE_FILE");
            });

            return defer.promise;
        }

        // ...
        unlockByFilePath__(walletId, filePath, password) {
            let defer = $q.defer();

            let importPromise = RPCService.makeCall('importEtherKeystoreFile', { filePath: filePath });
            importPromise.then((response) => {
                let promise = RPCService.makeCall('unlockEtherKeystoreObject', { keystoreObject: response.keystoreObject, password: password });
                promise.then((data) => {
                    $rootScope.wallet = new Wallet(walletId, data.privateKey, data.publicKey);
                    defer.resolve($rootScope.wallet);
                }).catch((error) => {
                    defer.reject("ERR_UNLOCK_KEYSTORE_FILE");
                });
            }).catch((error) => {
                defer.reject("ERR_UNLOCK_KEYSTORE_FILE");
            });

            return defer.promise;
        }

        unlockByFilePath(walletId, filePath, password) {
            let defer = $q.defer();

            let importPromise = RPCService.makeCall('readKeystoreObject', { filePath: filePath });
            importPromise.then((response) => {
                let promise = RPCService.makeCall('unlockEtherKeystoreObject', { keystoreObject: response.keystoreObject, password: password });
                promise.then((data) => {
                    $rootScope.wallet = new Wallet(walletId, data.privateKey, data.publicKey);
                    defer.resolve($rootScope.wallet);
                }).catch((error) => {
                    defer.reject("ERR_UNLOCK_KEYSTORE_FILE");
                });
            }).catch((error) => {
                defer.reject("ERR_UNLOCK_KEYSTORE_FILE");
            });

            return defer.promise;
        }

        // ...
        unlockByPrivateKey(privateKey) {
            let defer = $q.defer();

            let importPromise = RPCService.makeCall('importEtherPrivateKey', { privateKey: privateKey });
            importPromise.then((data) => {
                if(data.id){
                    $rootScope.wallet = new Wallet(data.id, data.privateKeyBuffer, data.publicKey);
                    defer.resolve($rootScope.wallet, true);
                }else{
                    defer.resolve(data, false);
                }
            }).catch((error) => {
                console.log(error);
                defer.reject("ERR_UNLOCK_PRIVATE_KEY");
            });

            return defer.promise;
        }

        loadBalance() {
            let defer = $q.defer();

            // TODO check wallet address
            let promise = Web3Service.getBalance("0x" + wallet.getPublicKeyHex());
            promise.then((balanceWei) => {
                wallet.balanceEth = EthUnits.toEther(balanceWei, 'wei');
                wallet.balanceEth = Number(CommonService.numbersAfterComma(wallet.balanceEth, 8));

                if (wallet.balanceWei !== balanceWei && !isFirstLoad) {
                    ElectronService.showNotification('Identity Wallet', 'ETH Balance Changed ' + wallet.balanceEth, {});
                }

                wallet.balanceWei = balanceWei;

                isFirstLoad = false;

                defer.resolve(wallet);
            }).catch((error) => {
                defer.reject(error);
            });

            return defer.promise;
        }

        loadTokenBalance(symbol) {
            // TODO check Address
            if (symbol) {
                //TokenService.loadBalanceBySymbol(wallet.getPublicKeyHex(), symbol);
            } else {
                //TokenService.loadAllbalance(wallet.getPublicKeyHex());
            }
        }

        /*
        getTransactionCount() {
            let defer = $q.defer();
            // TODO check wallet address
            let promise = Web3Service.getTransactionCount(wallet.getPublicKeyHex());
            promise.then((nonce) => {
                defer.resolve(nonce);
            }).catch((error) => {
                defer.reject(error);
            });
            return defer.promise;
        }
        */

        getGasPrice() {
            let defer = $q.defer();
            // TODO check wallet address
            let promise = Web3Service.getGasPrice();
            promise.then((data) => {
                defer.resolve(wallet);
            }).catch((error) => {
                defer.reject(error);
            });
            return defer.promise;
        }

        /**
         *
         * @param {hex} toAddressHex
         * @param {eth} valueWei
         * @param {wei} gasPriceWei
         * @param {wei} gasLimitWei
         * @param {hex} contractDataHex Contract data
         */
        // TODO moved inside Wallet class ($rootScope.wallet.generateRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, contractDataHex, chainID))
        /*
        generateEthRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, contractDataHex) {
            let defer = $q.defer();

            let promise = this.getTransactionCount();
            promise.then((nonce) => {
                //wallet.nonceHex

                let rawTx = {
                    nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
                    gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
                    gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
                    to: EthUtils.sanitizeHex(toAddressHex),
                    value: EthUtils.sanitizeHex(EthUtils.decimalToHex(valueWei)),
                    chainId: CONFIG.chainId
                }

                if (contractDataHex) {
                    rawTx.data = EthUtils.sanitizeHex(contractDataHex);
                }

                let eTx = new Tx(rawTx);
                eTx.sign(wallet.privateKey);

                defer.resolve('0x' + eTx.serialize().toString('hex'));
            }).catch((error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        */

        // TODO moveed inside Token class
        // $rootScope.wallet.tokens[theSymbol].generateRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, chainID)
        /*
        generateTokenRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, tokenSymbol) {
            let defer = $q.defer();
            let token = TokenService.getBySymbol(tokenSymbol);
            if (!token) {
                defer.reject("ERR_TOKEN_NOT_FOUND");
            }

            // TODO check token balance

            let promise = this.getTransactionCount();
            promise.then((nonce) => {
                let genResult = token.generateContractData(toAddressHex, valueWei);
                if (genResult.error) {
                    defer.reject(genResult.error);
                } else {
                    let rawTx = {
                        nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
                        gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
                        gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
                        to: EthUtils.sanitizeHex(token.contractAddress),
                        value: "0x00",
                        data: EthUtils.sanitizeHex(genResult.data),
                        chainId: CONFIG.chainId
                    }

                    let eTx = new Tx(rawTx);
                    //new Buffer(wallet.privateKey, 'hex')
                    eTx.sign(wallet.privateKey);

                    defer.resolve('0x' + eTx.serialize().toString('hex'));
                }
            }).catch((error) => {
                console.log(error);
                defer.reject(error);
            });

            return defer.promise;
        }
        */
    };

    return new WalletService();
}

module.exports = WalletService;
