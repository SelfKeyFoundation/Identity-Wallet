'use strict';
const async = require('async');
const EthUnits = requireAppModule('angular/classes/eth-units');

function LedgerService($rootScope, $window, $q, $timeout, $log, CONFIG, RPCService, CommonService, Web3Service) {
    'ngInject';

    $log.info('LedgerService Initialized');

    class LedgerService {
        constructor() { }

        connect() {
            return RPCService.makeCall('connectToLedger');
        }

        getAccountsWithBalances(args) {
            const loadBalances = (accounts, callback) => {
                let accountsArr = Object.keys(accounts).map((key) => {
                    return accounts[key];
                });
                let fns = {};
                accountsArr.forEach((address) => {
                    let fn = (callback) => {
                        let promise = Web3Service.getBalance(address);

                        promise.then((balanceWei) => {
                            let balanceEth = EthUnits.toEther(balanceWei, 'wei');
                            callback(null, Number(CommonService.numbersAfterComma(balanceEth, 15)));
                        }).catch((err) => {
                            callback(err);
                        });
                    };
                    fns[address] = fn;

                });

                async.parallel(fns, callback);
            };

            return new Promise((resolve, reject) => {
                RPCService.makeCall('getLedgerAccounts', args).then((accounts) => {

                    if (!accounts || Object.keys(accounts).length == 0) {
                        reject();
                        return;
                    }

                    loadBalances(accounts, (err, results) => {
                        if (err) {
                            reject();
                            return;
                        }

                        let accountsArr = Object.keys(results).map((key) => {
                            return {
                                address: key,
                                balanceEth: results[key]
                            }
                        }).sort((a, b) => {
                            return parseFloat(b.balanceEth) - parseFloat(a.balanceEth);
                        });
                        resolve(accountsArr);
                    });

                }).catch(err => {
                    reject(err);
                });
            })
        }

        createWalletByAddress(address) {
            return RPCService.makeCall('createLedgerWalletByAdress', { address });
        }

        signTransaction(dataToSign, address) {
            return new Promise((resolve, reject) => {
                RPCService.makeCall('signTransactionWithLedger', {
                    dataToSign,
                    address
                }).then(res => {
                    resolve(res.raw);
                }).catch(err => {
                    reject(err);
                })
            });
        }
    };

    return new LedgerService();
}

module.exports = LedgerService;
