'use strict';

import EthUnits from '../../../classes/eth-units';
import EthUtils from '../../../classes/eth-utils';

function SendTokenDialogController($rootScope, $scope, $log, $q, $mdDialog, $interval, args, Web3Service, WalletService, TokenService) {
    'ngInject'

    $log.info("SendTokenDialogController", args);

    $scope.symbol = args.token;                     // key
    $scope.publicKeyHex = args.publicKeyHex;

    $scope.step = 'prepare-transaction';

    $scope.sendAmountInUSD = 0.00;
    $scope.gasPriceInGwei = 50;
    $scope.gasLimit = args.gasLimit || 210000;

    $scope.data = {
        sendAmount: args.sendAmount || null,
        sendToAddress: args.sendToAddress || '',
        txStatus: null
    }
    $scope.editModeOfAddress = args.editModeOfAddress || true;
    $scope.editModeOfPrice = args.editModeOfPrice || true;

    $scope.itemPriceInUSD = 0; //["eth", "ETH"].indexOf($scope.symbol) !== -1 ? $rootScope.wallet.usdPerUnit : token.userPerUnit;

    $scope.selectAll = (event) => {
        $scope.data.sendAmount = angular.copy($scope.totalBalance)
    }

    $scope.sendPromise = null;
    $scope.txHex = null;

    $scope.send = (event, sendTokenForm) => {
        console.log($scope.symbol, $scope.data.sendToAddress, $scope.data.sendAmount, $scope.gasPriceInGwei)
        if (["eth", "ETH"].indexOf($scope.symbol) !== -1) {
            $rootScope.wallet.loadBalance().then(() => {
                $scope.totalBalance = $rootScope.wallet.balanceEth;
                sendEther($scope.data.sendToAddress, $scope.data.sendAmount, $scope.gasPriceInGwei);
            });
        } else {
            let token = TokenService.getBySymbol($scope.symbol);
            if (token) {
                token.loadBalance().then(() => {
                    $scope.totalBalance = token.getBalanceDecimal();
                    sendToken($scope.data.sendToAddress, $scope.data.sendAmount, $scope.gasPriceInGwei);
                });
            }
        }
    }

    $scope.getTransactionStatus = () => {
        if (!$scope.data.txStatus) {
            return 'Pending';
        } else {
            return $scope.data.txStatus === 0 ? 'Failed!' : 'Sent!';
        }
    }

    let txInfoCheckInterval = null;
    function startTxCheck() {
        txInfoCheckInterval = $interval(() => {
            if (!$scope.txHex) return;

            let txInfoPromise = Web3Service.getTransactionReceipt($scope.txHex.toString());
            txInfoPromise.then((txInfo) => {
                if (txInfo.blockNumber !== null) {
                    $scope.data.txStatus = Number(txInfo.status);
                    $interval.cancel(txInfoCheckInterval);
                    // TODO reload
                }
            }).catch((error) => {
                $interval.cancel(txInfoCheckInterval);
            });
        }, 2000);
    }

    function cancelTxCheck() {
        $interval.cancel(txInfoCheckInterval);
    }

    $scope.$on('$destroy', () => {
        cancelTxCheck();
    });


    /**
     * 
     */
    function sendEther(sendToAddress, sendAmount, gasPriceInGwei) {
        if (sendAmount > 0 && sendToAddress && gasPriceInGwei >= 1) {

            if (!EthUtils.validateEtherAddress(sendToAddress)) {
                // todo show message
                return;
            }

            if (sendAmount > $scope.totalBalance) {
                // todo show message
                return;
            }

            let txGenPromise = WalletService.generateEthRawTransaction(
                sendToAddress,
                EthUnits.unitToUnit(sendAmount, 'ether', 'wei'),
                EthUnits.unitToUnit(gasPriceInGwei, 'gwei', 'wei'),
                $scope.gasLimit
            );

            txGenPromise.then((signedHex) => {
                $scope.sendPromise = Web3Service.sendRawTransaction(signedHex);
                $scope.sendPromise.then((resp) => {
                    console.log(resp);
                    $scope.txHex = resp.transactionHash;
                    startTxCheck();
                    $scope.step = 'transaction-status';
                }).catch((error) => {
                    console.log(">>>", "error", error);
                });
            });
        }
    }

    function sendToken(sendToAddress, sendAmount, gasPriceInGwei) {
        if (sendAmount > 0 && sendToAddress && gasPriceInGwei >= 1) {
            if (!EthUtils.validateEtherAddress(sendToAddress)) {
                // todo show message
                return;
            }

            if (sendAmount > $scope.totalBalance) {
                // todo show message
                return;
            }

            let txGenPromise = WalletService.generateTokenRawTransaction(
                sendToAddress,
                sendAmount,
                EthUnits.unitToUnit(gasPriceInGwei, 'gwei', 'wei'),
                $scope.gasLimit,
                $scope.symbol.toUpperCase()
            )

            txGenPromise.then((signedHex) => {
                console.log(">>>> signedHex >>>>>", signedHex);

                $scope.sendPromise = Web3Service.sendRawTransaction(signedHex);
                $scope.sendPromise.then((resp) => {
                    console.log(">>>> sendPromise >>>>>", resp);
                    $scope.txHex = resp.transactionHash;
                    startTxCheck();
                    $scope.step = 'transaction-status';
                }).catch((error) => {
                    console.log(">>>", "error", error);
                });
            });
        }
    }



    // test --- generating good tx
    /*
    let a = WalletService.generateTokenRawTransaction(
        "0x4e7776ce0510778f44e8d43fa2d4d13b5d3930d5",
        10000,
        35000000000,
        150000,
        "QEY"
    )
    console.log(a, "<<<<<<<<");
    */


    $scope.cancel = (event) => {
        cancelTxCheck();
        $mdDialog.cancel();
    }
};

export default SendTokenDialogController;




