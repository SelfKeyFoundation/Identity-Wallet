'use strict';

const EthUnits = requireAppModule('angular/classes/eth-units');
const EthUtils = requireAppModule('angular/classes/eth-utils');
const Token = requireAppModule('angular/classes/token');

let $rootScope, $q, $interval, Web3Service, CommonService, ElectronService, SqlLiteService, EtherScanService;

let readyToShowNotification = false;

let priceUpdaterInterval, loadBalanceInterval = null;

class Wallet {

    static set $rootScope(value) { $rootScope = value; }
    static set $q(value) { $q = value; }
    static set $interval(value) { $interval = value; }
    static set Web3Service(value) { Web3Service = value; }
    static set CommonService(value) { CommonService = value; }
    static set ElectronService(value) { ElectronService = value; } // TODO remove (use RPCService instead)
    static set SqlLiteService(value) { SqlLiteService = value; }
    static set EtherScanService(value) { EtherScanService = value; }

    constructor(id, privateKey, publicKey, keystoreFilePath) {
        this.id = id;
        this.keystoreFilePath = keystoreFilePath;

        this.privateKey = privateKey;
        this.privateKeyHex = privateKey ? privateKey.toString('hex') : null;

        this.publicKey = publicKey;
        this.publicKeyHex = publicKey ? publicKey.toString('hex') : null;

        this.balanceWei = 0;
        this.balanceEth = 0;

        this.balanceInUsd = 0;
        this.usdPerUnit = 0;

        this.totalBalanceInUSD = 0;

        this.tokens = {};
        this.idAttributes = {}

        this.updatePriceInUSD();

        this.startPriceUpdater();
        this.startBalanceUpdater();

        this.initialBalancePromise = this.loadBalance();
    }

    getPrivateKey() {
        return this.privateKey;
    }

    getPrivateKeyHex() {
        return this.privateKeyHex;
    }

    getBalanceInUsd() {
        return this.balanceInUsd;
    }

    getPublicKey() {
        return this.publicKey;
    }

    getPublicKeyHex() {
        return this.publicKeyHex;
    }

    loadBalance() {
        let defer = $q.defer();
        let promise = Web3Service.getBalance("0x" + this.getPublicKeyHex());

        promise.then((balanceWei) => {
            let oldBalanceInWei = angular.copy(this.balanceWei);

            this.balanceEth = EthUnits.toEther(balanceWei, 'wei');
            this.balanceEth = Number(CommonService.numbersAfterComma(this.balanceEth, 8));
            this.balanceWei = balanceWei;

            this.calculateBalanceInUSD();
            if (balanceWei !== oldBalanceInWei) {
                $rootScope.$broadcast('balance:change', 'eth', this.balanceEth, this.balanceInUsd);
                if (readyToShowNotification) {
                    ElectronService.showNotification('ETH Balance Changed', 'New Balance: ' + this.balanceEth);
                }
            }

            readyToShowNotification = true;

            defer.resolve(this);
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    setPriceInUsd(usdPerUnit) {
        this.usdPerUnit = usdPerUnit;
        this.calculateBalanceInUSD();
    }

    calculateBalanceInUSD() {
        this.balanceInUsd = (Number(this.balanceEth) * Number(this.usdPerUnit));
        this.calculateTotalBalanceInUSD();
        return this.balanceInUsd;
    }

    calculateTotalBalanceInUSD() {
        this.totalBalanceInUSD = this.balanceInUsd;
        for (let i in this.tokens) {
            let token = this.tokens[i];

            this.totalBalanceInUSD += token.balanceInUsd;
        }
        return this.totalBalanceInUSD;
    }

    getFormattedBalance() {
        return this.balanceEth;
    }

    getFormattedBalanceInUSD() {
        return CommonService.numbersAfterComma(this.balanceInUsd, 2);
    }

    getFormatedTotalBalanceInUSD() {
        return CommonService.numbersAfterComma(this.totalBalanceInUSD, 2);
    }

    updatePriceInUSD() {
        let price = SqlLiteService.getTokenPriceBySymbol("ETH");
        if (price) {
            this.setPriceInUsd(price.priceUSD);
        }
    }

    /**
     * jobs
     */
    startPriceUpdater() {
        priceUpdaterInterval = $interval(() => {
            this.updatePriceInUSD();
        }, 5000)
    }

    cancelPriceUpdater() {
        $interval.cancel(priceUpdaterInterval);
    }

    startBalanceUpdater() {
        loadBalanceInterval = $interval(() => {
            this.loadBalance();
        }, 30000)
    }

    cancelBalanceUpdater() {
        $interval.cancel(loadBalanceInterval);
    }

    /**
     * tokens
     */
    loadTokens() {
        let defer = $q.defer();
        SqlLiteService.loadWalletTokens(this.id).then((walletTokens) => {
            this.tokens = {};
            for (let i in walletTokens) {
                let token = walletTokens[i];
                this.tokens[token.symbol.toUpperCase()] = this.addNewToken(token);
            }
            defer.resolve(this.tokens);
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }



    addNewToken(data) {
        let newToken = new Token(data.address, data.symbol, data.decimal, data.isCustom, data.tokenId, data.id, this);
        this.tokens[data.symbol.toUpperCase()] = newToken;
        return newToken;
    }

    /**
     * ID Attributes
     */
    loadIdAttributes() {
        let defer = $q.defer();

        SqlLiteService.loadIdAttributes(this.id).then((idAttributes) => {
            this.idAttributes = {};

            for (let i in idAttributes) {
                this.idAttributes[idAttributes[i].idAttributeType] = idAttributes[i];
            }

            defer.resolve(this.idAttributes);
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    getIdAttributes() {
        return this.idAttributes;
    }

    // temporary method - while we support only *ONE* item/value per attribute
    getIdAttributeItemValue(idAttributeTypeKey, line) {
        if (this.idAttributes[idAttributeTypeKey] && this.idAttributes[idAttributeTypeKey].items && this.idAttributes[idAttributeTypeKey].items.length && this.idAttributes[idAttributeTypeKey].items[0].values && this.idAttributes[idAttributeTypeKey].items[0].values.length) {
            return this.idAttributes[idAttributeTypeKey].items[0].values[0].staticData[line] || this.idAttributes[idAttributeTypeKey].items[0].values[0].documentId
        }
        //return  && (this.idAttributes[idAttributeTypeKey].items[0].values[0].staticData || this.idAttributes[idAttributeTypeKey].items[0].values[0].documentId) ? this.idAttributes[idAttributeTypeKey].items[0].values[0].staticData || this.idAttributes[idAttributeTypeKey].items[0].values[0].documentId : null;
    }

    /**
     *
     * @param {*} toAddressHex
     * @param {*} valueWei
     * @param {*} gasPriceWei
     * @param {*} gasLimitWei
     * @param {*} contractDataHex
     * @param {*} chainID
     */
    generateRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, contractDataHex, chainID) {
        let defer = $q.defer();

        let promise = Web3Service.getTransactionCount(this.getPublicKeyHex());
        promise.then((nonce) => {
            //wallet.nonceHex

            let rawTx = {
                nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
                gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
                gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
                to: EthUtils.sanitizeHex(toAddressHex),
                value: EthUtils.sanitizeHex(EthUtils.decimalToHex(valueWei)),
                chainId: chainID || 3 // if missing - use ropsten testnet
            }

            if (contractDataHex) {
                rawTx.data = EthUtils.sanitizeHex(contractDataHex);
            }

            let eTx = new Tx(rawTx);
            eTx.sign(this.privateKey);

            defer.resolve('0x' + eTx.serialize().toString('hex'));
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    processTransactionsHistory(data) {
        let tokens = $rootScope.wallet.tokens;

        let getTokenById = (id) => {
            let tokenKey = Object.keys(tokens).find((key) => {
                let token = tokens[key];
                if (token.id == id) {
                    return true;
                }
            });
            return tokens[tokenKey];
        };

        return data.map((transaction) => {
            transaction.symbol = transaction.tokenId ? getTokenById(transaction.tokenId).symbol.toUpperCase() : 'ETH';

            //is sent
            if (transaction.sentTo) {
                transaction.sentToName = null; //WalletService.getWalletName(transaction.symbol.toLowerCase(), transaction.sentTo);
            }

            if (transaction.tokenId) {
                let token = getTokenById(transaction.tokenId);
            }
            let sendText = transaction.sentToName ? 'Sent to' : 'Sent';
            transaction.sentOrReceiveText = transaction.sentTo ? sendText : 'Received';
            transaction.value = new BigNumber(transaction.value).toString(10);
            return transaction;
        }).sort((a, b) => {
            return Number(b.timestamp) - Number(a.timestamp);
        });
    };

    syncEthTransactionsHistory() {
        let wallet = this;
        let walletAddress = '0x' + this.getPublicKeyHex();
        let ethKey = 'eth';
        let valueDivider = new BigNumber(10 ** 18);

        $rootScope.transactionHistorySyncStatuses = $rootScope.transactionHistorySyncStatuses || {};
        $rootScope.transactionHistorySyncStatuses[ethKey.toUpperCase()] = false;

        let finishFn = (blockNumber) => {
            $rootScope.transactionHistorySyncStatuses[ethKey.toUpperCase()] = true;

            SqlLiteService.getWalletSettingsByWalletId(wallet.id).then(settings => {
                let setting = settings[0];
                setting.EthTxHistoryLastBlock = blockNumber;
                SqlLiteService.saveWalletSettings(setting).catch((err) => {
                    console.log(err); //TODO
                })
            }).catch(err => {
                //TODO
            });

        };

        Web3Service.getMostRecentBlockNumber().then((blockNumber) => {
            SqlLiteService.getWalletSettingsByWalletId(wallet.id).then(settings => {

                let setting = settings[0];
                let previousLastBlockNumber = setting.EthTxHistoryLastBlock || blockNumber;
                let startBlock = previousLastBlockNumber;
                let endBlock = blockNumber;
                let ethTransactions = [];

                EtherScanService.getTransactionsHistory(walletAddress, startBlock, endBlock).then((result) => {
                    result = result || [];
                    result.forEach((transaction) => {
                        let value = transaction.value;
                        //means that it is eth transaction
                        if (value && Number(value) > 0) {
                            ethTransactions.push(transaction);
                        }
                    });

                    if (!ethTransactions.length) {
                        return finishFn(endBlock);
                    }
                    ethTransactions.forEach((transaction, index) => {
                        let currentIdex = index;
                        let value = new BigNumber(transaction.value).div(valueDivider).toString();
                        let sentTo = (transaction.from || '').toLowerCase() == walletAddress.toLowerCase() ? transaction.to : null;

                        let newTransaction = {
                            walletId: wallet.id,
                            timestamp: Number(transaction.timeStamp + '000'),
                            blockNumber: transaction.blockNumber,
                            value: Number(value),
                            txId: transaction.hash,
                            sentTo: sentTo,
                            gas: Number(transaction.gas),
                            gasPrice: transaction.gasPrice,
                        };

                        SqlLiteService.insertTransactionHistory(newTransaction).then((insertedTransaction) => {
                            if (currentIdex == ethTransactions.length - 1) {
                                finishFn(endBlock);
                            }
                        }).catch(err => {
                            if (currentIdex == ethTransactions.length - 1) {
                                finishFn(endBlock);
                            }
                        });
                    });

                });
            });
        });
    }

}

module.exports = Wallet;
