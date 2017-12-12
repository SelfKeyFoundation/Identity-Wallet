'use strict';

import EthUnits from '../../classes/eth-units';

function SkSendTokenDirective($log, $window, $timeout, $interval, WalletService, Web3Service) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            token: '@'
        },
        link: (scope, element) => {
            scope.step = 'prepare-transaction';

            scope.token = scope.token || 'eth';
            
            scope.sendAmountInUSD = 0.00;
            scope.gasPriceInGwei = 50;

            scope.data = {
                sendAmountInEth: null,
                sendToAddress: '',
                txStatus: null
            }

            // TODO - for tokens from where we should get it ?
            scope.itemPriceInUSD = 0;

            // get latest balance
            loadBalance();

            scope.selectAll = (event) => {
                scope.sendAmountInEth = angular.copy(scope.totalBalanceInEth)
            }

            scope.sendPromise = null;
            scope.txHex = null;
            scope.send = (event) => {
                console.log(scope.data.sendAmountInEth, scope.data.sendToAddress, scope.gasPriceInGwei);
                if(scope.data.sendAmountInEth > 0 && scope.data.sendToAddress && scope.gasPriceInGwei >= 1){
                    
                    if(scope.data.sendAmountInEth > scope.totalBalanceInEth){
                        scope.data.sendAmountInEth = angular.copy(scope.totalBalanceInEth);
                    }

                    // '0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb'
                    // working example
                    let txGenPromise = WalletService.generateEthRawTransaction(
                        scope.data.sendToAddress,
                        EthUnits.unitToUnit(scope.data.sendAmountInEth, 'ether', 'wei'),
                        EthUnits.unitToUnit(scope.gasPriceInGwei, 'gwei', 'wei'),
                        21000
                    );
    
                    txGenPromise.then((signedHex)=>{
                        console.log("signedHex", signedHex);

                        scope.sendPromise = Web3Service.sendRawTransaction(signedHex);
                        scope.sendPromise.then((resp)=>{
                            scope.txHex = resp.transactionHash;
                            startTxCheck();
                            scope.step = 'transaction-status';
                        }).catch((error)=>{
                            console.log(">>>", "error", error);
                        });
                    });
                }
            }

            scope.close = () => {
                element.remove();
                scope.$destroy();
            }

            scope.getTransactionStatus = () => {
                if(!scope.data.txStatus){
                    return 'Pending';
                }else{
                    return scope.data.txStatus === 0 ? 'Failed!' : 'Sent!';
                }
            }

            let txInfoCheckInterval = null;
            function startTxCheck() {
                txInfoCheckInterval = $interval(() => {
                    if(!scope.txHex) return;

                    let txInfoPromise = Web3Service.getTransactionReceipt(scope.txHex.toString());
                    txInfoPromise.then((txInfo) => {
                        if (txInfo.blockNumber !== null) {
                            scope.data.txStatus = Number(txInfo.status);
                            $interval.cancel(txInfoCheckInterval);
                            loadBalance();
                        }
                    }).catch((error)=>{
                        $interval.cancel(txInfoCheckInterval);
                    });
                }, 2000);
            }

            function cancelTxCheck() {
                $interval.cancel(txInfoCheckInterval);
            }

            function loadBalance () {
                WalletService.loadBalance().then((wallet) => {
                    scope.totalBalanceInEth = wallet.balanceEth;
                    scope.totalBalanceInWei = wallet.balanceWei;
                }).catch((error)=>{
                    $log.error(error);
                });
            }

            scope.$on('$destroy', () => {
                cancelTxCheck();
            });
        },
        replace: true,
        templateUrl: 'common/directives/sk-send-token.html'
    }
}

export default SkSendTokenDirective;