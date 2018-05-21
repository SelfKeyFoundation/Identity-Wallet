const Wallet = requireAppModule('angular/classes/wallet');
const EthUnits = requireAppModule('angular/classes/eth-units');
const EthUtils = requireAppModule('angular/classes/eth-utils');
const Token = requireAppModule('angular/classes/token');

function dec2hexString(dec) {
    return '0x' + (dec + 0x10000).toString(16).substr(-4).toUpperCase();
}

// documentation
// https://www.myetherapi.com/
function Web3Service($rootScope, $window, $log, EVENTS, SqlLiteService, RPCService) {
    'ngInject';

    $log.info('Web3Service Initialized');

    /**
     *
     */
    class Web3Service {

        constructor() {
            Web3Service.web3 = new Web3();
            EthUtils.web3 = new Web3();
            window.EthUtils = EthUtils;
        }
        // this will be removed after tx-history refactor
        syncTokensTransactionHistory(tokenSymbol) {
            let wallet = $rootScope.wallet;
            if (!wallet || !wallet.tokens) {
                return;
            }

            let tokens = tokenSymbol ? [wallet.tokens[tokenSymbol.toUpperCase()]]: wallet.tokens;

            let walletAddress = '0x' + $rootScope.wallet.publicKeyHex;

            $rootScope.transactionHistorySyncStatuses = $rootScope.transactionHistorySyncStatuses || {};

            let getActivity = (contractAddress, fromBlock, toBlock, filter) => {
                return Web3Service.getContractPastEvents(contractAddress, ['Transfer', {
                    filter: filter,
                    fromBlock: fromBlock,
                    toBlock: toBlock
                }]);
            };

            Object.keys(tokens).forEach(key => {
                let token = tokens[key];
                let valueDivider = new BigNumber(10 ** token.decimal);

                $rootScope.transactionHistorySyncStatuses[key.toUpperCase()] = false;

                let processAllActivities = (fromBlock, toBlock) => {
                    // process from
                    getActivity(token.contractAddress, fromBlock, toBlock, { from: walletAddress }).then(logsFrom => {
                        //process to
                        getActivity(token.contractAddress, fromBlock, toBlock, { to: walletAddress }).then(logsTo => {
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

        static getContractPastEvents(contractAddress, args) {
            return Web3Service.waitForTicket('getPastEvents', args, contractAddress);
        }

        getContractInfo(contractAddress) {

            let decimalsPromise = Web3Service.waitForTicket('call', [], contractAddress, 'decimals');
            let symbolPromise = Web3Service.waitForTicket('call', [], contractAddress, 'symbol');

            return Promise.all([decimalsPromise, symbolPromise]);
        }

        getMostRecentBlockNumber() {
            return Web3Service.waitForTicket('getBlockNumber', []);
        }

        static getMostRecentBlockNumberStatic() {
            return Web3Service.waitForTicket('getBlockNumber', []);
        }

        getBalance(addressHex) {
            return Web3Service.waitForTicket('getBalance', [addressHex]);
        }

        getTokenBalanceByData(data) {
            return Web3Service.waitForTicket('call', [data]);
        }

        getEstimateGas(fromAddressHex, toAddressHex, amountHex) {
            let args = {
                "from": fromAddressHex,
                "to": toAddressHex,
                "value": amountHex
            }

            return Web3Service.waitForTicket('estimateGas', [args]);
        }

        getGasPrice() {
            return Web3Service.waitForTicket('getGasPrice', []);
        }

        getTransactionCount(addressHex) {
            return Web3Service.waitForTicket('getTransactionCount', [addressHex, 'pending']);
        }

        sendRawTransaction(signedTxHex) {
            return Web3Service.waitForTicket('sendSignedTransaction', [signedTxHex]);
        }

        getTransaction(transactionHex) {
            return Web3Service.waitForTicket('getTransaction', [transactionHex]);
        }

        getTransactionReceipt(transactionHex) {
            return Web3Service.waitForTicket('getTransactionReceipt', [transactionHex]);
        }

        static getBlock(blockNumber, withTransactions) {
            withTransactions = withTransactions || false;
            return Web3Service.waitForTicket('getBlock', [blockNumber, withTransactions]);
        }

        static waitForTicket(method, args, contractAddress, contractMethod) {
            return RPCService.makeCall('waitForWeb3Ticket', { method, args, contractAddress, contractMethod });
        }
    };

    return new Web3Service();
}

module.exports = Web3Service;
