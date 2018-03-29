const Wallet = requireAppModule('angular/classes/wallet');
const EthUnits = requireAppModule('angular/classes/eth-units');
const EthUtils = requireAppModule('angular/classes/eth-utils');
const Token = requireAppModule('angular/classes/token');

const ABI = requireAppModule('angular/store/abi.json').abi;

function dec2hexString(dec) {
    return '0x' + (dec + 0x10000).toString(16).substr(-4).toUpperCase();
}

// documentation
// https://www.myetherapi.com/
function Web3Service($rootScope, $window, $q, $timeout, $log, $http, $httpParamSerializerJQLike, EVENTS, CommonService, $interval, CONFIG, SqlLiteService) {
    'ngInject';

    $log.info('Web3Service Initialized');

    /**
     *
     */
    const REQUEST_INTERVAL_DELAY = 500;

    /**
     *
     */
    const SERVER_CONFIG = {
        mew: {
            1: { url: "https://api.myetherapi.com/eth" },
            3: { url: "https://api.myetherapi.com/rop" }
        },
        infura: {
            1: { url: "https://mainnet.infura.io" },
            3: { url: "https://ropsten.infura.io" }
        }
    }

    const SELECTED_SERVER_URL = SERVER_CONFIG[CONFIG.node][CONFIG.chainId].url;

    let lastRequestTime = 0;
    const requestQueue = [];

    /**
     *
     */
    class Web3Service {

        constructor() {
            Web3Service.web3 = new Web3();

            Web3Service.web3.setProvider(new Web3Service.web3.providers.HttpProvider(SELECTED_SERVER_URL));

            EthUtils.web3 = new Web3();
            window.EthUtils = EthUtils;


            Web3Service.q = async.queue((data, callback) => {
                $log.info("WEB3 REQUESTS IN QUEUE: ", Web3Service.q.length(), "######");

                let baseFn = data.contract ? data.contract : Web3Service.web3.eth;
                let self = data.contract ? data.contract : this;

                if (data.baseFn) {
                    baseFn = data.baseFn;
                }
                let promise = baseFn[data.method].apply(self, data.args);

                $timeout(() => {
                    callback(promise);
                }, REQUEST_INTERVAL_DELAY);
            }, 1);
        }

        syncTokensTransactionHistory(tokenSymbol) {
            let wallet = $rootScope.wallet;
            if (!wallet || !wallet.tokens) {
                return;
            }

            let tokens = tokenSymbol ? [wallet.tokens[tokenSymbol.toUpperCase()]]: wallet.tokens;

            let walletAddress = '0x' + $rootScope.wallet.publicKeyHex;

            $rootScope.transactionHistorySyncStatuses = $rootScope.transactionHistorySyncStatuses || {};

            let getActivity = (contract, fromBlock, toBlock, filter) => {
                return Web3Service.getContractPastEvents(contract, ['Transfer', {
                    filter: filter,
                    fromBlock: fromBlock,
                    toBlock: toBlock
                }]);
            };

            Object.keys(tokens).forEach(key => {
                let token = tokens[key];
                let valueDivider = new BigNumber(10 ** token.decimal);

                $rootScope.transactionHistorySyncStatuses[key.toUpperCase()] = false;
                let contract = new Web3Service.web3.eth.Contract(ABI, token.contractAddress);

                let processAllActivities = (fromBlock, toBlock) => {
                    // process from
                    getActivity(contract, fromBlock, toBlock, { from: walletAddress }).then(logsFrom => {
                        //process to
                        getActivity(contract, fromBlock, toBlock, { to: walletAddress }).then(logsTo => {
                            logsFrom = logsFrom || [];
                            logsTo = logsTo || [];

                            let transactions = logsFrom.map((logFrom) => {
                                logFrom.sentTo = logFrom.returnValues.to;
                                return logFrom;
                            }).concat(logsTo.map((logTo) => {
                                return logTo;
                            }));

                            (function next(err) {
                                if (/*|| err*/ !transactions.length) {
                                    $rootScope.transactionHistorySyncStatuses[key.toUpperCase()] = true;

                                    SqlLiteService.getWalletSettingsByWalletId(wallet.id).then(settings => {
                                        let setting = settings[0];
                                        setting.ERC20TxHistoryLastBlock = toBlock;
                                        SqlLiteService.saveWalletSettings(setting).catch((err) => {
                                            console.log(err); //TODO
                                        })
                                    }).catch(err => {
                                        //TODO
                                    });

                                    return;
                                }

                                let transaction = transactions.shift();
                                let blockNumber = transaction.blockNumber;
                                let txId = transaction.transactionHash;
                                Web3Service.getBlock(blockNumber, true).then((blockData) => {
                                    let transactionFromBlok = blockData.transactions.find((blockTransaction => {
                                        return blockTransaction.hash == txId;
                                    }));

                                    let newTransaction = {
                                        walletId: wallet.id,
                                        tokenId: token.id,
                                        timestamp: Number(blockData.timestamp + '000'),
                                        blockNumber: blockNumber,
                                        value: Number(new BigNumber(transaction.returnValues.value).div(valueDivider).toString()),
                                        txId: txId,
                                        sentTo: transaction.sentTo || null,
                                        gas: Number(transactionFromBlok.gas),
                                        gasPrice: transactionFromBlok.gasPrice
                                    };

                                    SqlLiteService.insertTransactionHistory(newTransaction).then((insertedTransaction) => {
                                        next();
                                    }).catch(err => {
                                        next(err);
                                    });
                                });


                            })();
                        });
                    });
                }

                Web3Service.getMostRecentBlockNumberStatic().then((lastBlock) => {
                    SqlLiteService.getWalletSettingsByWalletId(wallet.id).then(settings => {
                        let setting = settings[0];
                        let fromBlock = setting.ERC20TxHistoryLastBlock || lastBlock;
                        processAllActivities(fromBlock, lastBlock);
                    }).catch(err => {
                        //TODO
                    });
                });
            });
        }

        static getContractPastEvents(contract, args) {
            let defer = $q.defer();

            // wei
            Web3Service.waitForTicket(defer, 'getPastEvents', args, contract);

            return defer.promise;
        }

        getContractInfo(contractAddress) {

            let deferDecimal = $q.defer();
            let deferSymbol = $q.defer();

            var tokenContract = new Web3Service.web3.eth.Contract(ABI,contractAddress);
            let decimalFn = tokenContract.methods.decimals();
            var symbolFn = tokenContract.methods.symbol();

            // wei
            Web3Service.waitForTicket(deferDecimal, 'call', [], null, decimalFn);
            Web3Service.waitForTicket(deferSymbol, 'call', [], null, symbolFn);

            return $q.all([deferDecimal.promise,deferSymbol.promise]);
        }

        getMostRecentBlockNumber() {
            let defer = $q.defer();

            // wei
            Web3Service.waitForTicket(defer, 'getBlockNumber', []);

            return defer.promise;
        }

        static getMostRecentBlockNumberStatic() {
            let defer = $q.defer();

            // wei
            Web3Service.waitForTicket(defer, 'getBlockNumber', []);

            return defer.promise;
        }

        getBalance(addressHex) {
            let defer = $q.defer();

            // wei
            Web3Service.waitForTicket(defer, 'getBalance', [addressHex]);

            return defer.promise;
        }

        getTokenBalanceByData(data) {
            let defer = $q.defer();

            // wei
            Web3Service.waitForTicket(defer, 'call', [data]);

            return defer.promise;
        }

        getEstimateGas(fromAddressHex, toAddressHex, amountHex) {
            let defer = $q.defer();

            let args = {
                "from": fromAddressHex,
                "to": toAddressHex,
                "value": amountHex
            }

            // wei
            Web3Service.waitForTicket(defer, 'estimateGas', [args]);

            return defer.promise;
        }

        getGasPrice() {
            let defer = $q.defer();

            // wei
            Web3Service.waitForTicket(defer, 'getGasPrice', []);

            return defer.promise;
        }

        getTransactionCount(addressHex) {
            let defer = $q.defer();

            // number
            Web3Service.waitForTicket(defer, 'getTransactionCount', [addressHex, 'pending']);

            return defer.promise;
        }

        sendRawTransaction(signedTxHex) {
            let defer = $q.defer();

            Web3Service.waitForTicket(defer, 'sendSignedTransaction', [signedTxHex]);

            return defer.promise;
        }

        getTransaction(transactionHex) {
            let defer = $q.defer();

            Web3Service.waitForTicket(defer, 'getTransaction', [transactionHex]);

            return defer.promise;
        }

        getTransactionReceipt(transactionHex) {
            let defer = $q.defer();

            Web3Service.waitForTicket(defer, 'getTransactionReceipt', [transactionHex]);

            return defer.promise;
        }

        static getBlock(blockNumber, withTransactions) {
            withTransactions = withTransactions || false;
            let defer = $q.defer();

            // wei
            Web3Service.waitForTicket(defer, 'getBlock', [blockNumber, withTransactions]);

            return defer.promise;
        }


        static waitForTicket(defer, method, args, contract, baseFn) {
            Web3Service.q.push({ method: method, args: args, contract: contract, baseFn: baseFn }, (promise) => {
                $log.info("handle response", method);
                promise.then((response) => {
                    $log.info("method response", method, response);
                    defer.resolve(response)
                }).catch((error) => {
                    $log.error("method response error", method, error);
                    defer.reject(error);
                });
            });
        }
    };

    return new Web3Service();
}

module.exports = Web3Service;
