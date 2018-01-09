'use strict';

import EthUnits from '../../../classes/eth-units';
import EthUtils from '../../../classes/eth-utils';

function SendTokenDialogController($rootScope, $scope, $log, $q, $mdDialog, $interval, args, Web3Service, WalletService, TokenService) {
    'ngInject'

    $log.info("SendTokenDialogController", args);

    const TX_CHECK_INTERVAL = 1000;
    const ESTIMATED_GAS_CHECK_INTERVAL = 300;

    let txInfoCheckInterval = null;

    let estimatedGasNeedsCheck = false;

    const web3Utils = Web3Service.constructor.web3.utils;

    let token = null;
    $scope.invalidData = false;
    $scope.symbol = args.symbol;

    /**
     * form data
     */
    $scope.formData = {
        sendAmount: args.sendAmount || null,
        sendToAddressHex: args.sendToAddressHex || '',
        gasPriceInGwei: args.gasPriceInGwei || 50
    }

    /**
     * informational data
     */
    $scope.infoData = {
        usdPerUnit: 0,

        sendAmountInUSD: 0.00,

        totalBalance: 0,
        totalBalanceInUsd: 0,

        reminingBalance: 0,
        reminingBalanceInUsd: 0,

        gasLimit: args.gasLimit || 210000,

        txFeeInEth: 0,
        txFeeInUsd: 0
    }

    /**
     * 
     */
    $scope.backgroundProcessStatuses = {
        checkingTransaction: false,
        checkingEstimatedGasLimit: false
    }

    /**
     * input states
     */
    $scope.inputStates = {
        isAddressLocked: args.isAddressLocked,
        isAmountLocked: args.isAmountLocked,
        isGasPriceLocked: args.isGasPriceLocked
    }

    /**
     * 
     */
    $scope.viewStates = {
        step: 'prepare-transaction',
        showConfirmButtons: false
    }

    /**
     * 
     */
    $scope.errors = {
        sendToAddressHex: false,
        sendAmount: false,
        sendFailed: false
    }

    /**
     * 
     */
    if ($scope.symbol.toLowerCase() === 'eth') {
        $scope.infoData.usdPerUnit = $rootScope.wallet.usdPerUnit;
        $scope.infoData.totalBalance = $rootScope.wallet.balanceEth;
    } else {
        let token = TokenService.getBySymbol($scope.symbol);
        $scope.infoData.usdPerUnit = token.usdPerUnit;
        $scope.infoData.totalBalance = token.getBalanceDecimal();
    }

    /**
     * 
     */
    $scope.selectAll = (event) => {
        $scope.formData.sendAmount = angular.copy($scope.infoData.totalBalance);
    }

    $scope.startSend = (event) => {
        $scope.viewStates.showConfirmButtons = true
    }

    $scope.confirmSend = (event, confirm) => {
        if(!confirm) {
            setViewState('before-send');
        }else{
            setViewState('sending');
            if ($scope.symbol.toLowerCase() === 'eth') {
                sendEther($scope.formData.sendToAddressHex, $scope.formData.sendAmount, $scope.formData.gasPriceInGwei);
            } else {
                sendToken($scope.formData.sendToAddressHex, $scope.formData.sendAmount, $scope.formData.gasPriceInGwei);
            }
        }
    }

    // TODO remove
    $scope.send = (event, sendTokenForm) => {
        $scope.backgroundProcessStatuses.checkingTransaction = true;

        if ($scope.symbol.toLowerCase() === 'eth') {
            sendEther($scope.formData.sendToAddressHex, $scope.formData.sendAmount, $scope.formData.gasPriceInGwei);
        } else {
            sendToken($scope.formData.sendToAddressHex, $scope.formData.sendAmount, $scope.formData.gasPriceInGwei);
        }
    }

    $scope.getTransactionStatus = () => {
        if (!$scope.backgroundProcessStatuses.checkingTransaction) {
            return 'Pending';
        } else {
            return $scope.backgroundProcessStatuses.checkingTransaction === 0 ? 'Failed!' : 'Sent!';
        }
    }

    $scope.cancel = (event) => {
        cancelEstimatedGasCheck();
        cancelTxCheck();
        $mdDialog.cancel();
    }

    $scope.getReminingBalance = () => {
        if($scope.formData.sendAmount) {
           return Number($scope.infoData.totalBalance) - Number($scope.formData.sendAmount);
        }else{
            return $scope.infoData.totalBalance
        }
    }

    $scope.getTxFee = () => {
        let wei = Number($scope.formData.gasPriceInGwei) * Number($scope.infoData.gasLimit);
        //console.log(wei, EthUnits.toEther(wei, 'wei'));
        return EthUnits.toEther(wei, 'wei');
    };

    /**
     * 
     */
    function startTxCheck() {
        cancelTxCheck();

        txInfoCheckInterval = $interval(() => {
            if (!$scope.txHex) return;

            let txInfoPromise = Web3Service.getTransactionReceipt($scope.txHex.toString());
            txInfoPromise.then((txInfo) => {
                if (txInfo.blockNumber !== null) {
                    $scope.backgroundProcessStatuses.checkingTransaction = Number(txInfo.status);
                    $interval.cancel(txInfoCheckInterval);
                }
            }).catch((error) => {
                cancelTxCheck();
            });
        }, TX_CHECK_INTERVAL);
    }

    /**
     * 
     */
    function cancelTxCheck() {
        if (txInfoCheckInterval) {
            $interval.cancel(txInfoCheckInterval);
        }
    }

    function cancelEstimatedGasCheck() {
        if (checkEstimatedGasInterval) {
            $interval.cancel(checkEstimatedGasInterval);
        }
    }

    function sendEther(sendToAddress, sendAmount, gasPriceInGwei) {
        if (sendAmount > 0 && sendToAddress && gasPriceInGwei >= 1) {
            if (sendAmount > $scope.totalBalance) {
                // todo show message
                return;
            }

            let txGenPromise = WalletService.generateEthRawTransaction(
                sendToAddress,
                EthUnits.unitToUnit(sendAmount, 'ether', 'wei'),
                EthUnits.unitToUnit(gasPriceInGwei, 'gwei', 'wei'),
                $scope.infoData.gasLimit
            );

            txGenPromise.then((signedHex) => {
                $scope.sendPromise = Web3Service.sendRawTransaction(signedHex);
                $scope.sendPromise.then((resp) => {
                    console.log(resp);
                    $scope.txHex = resp.transactionHash;
                    startTxCheck();
                    $scope.viewStates.step = 'transaction-status';
                }).catch((error) => {
                    $scope.errors.sendFailed = error.toString();
                    // reset view state
                    setViewState();
                });
            }).catch((error)=>{
                $scope.errors.sendFailed = error.toString();
                // reset view state
                setViewState();
            });
        }
    }

    function sendToken(sendToAddress, sendAmount, gasPriceInGwei) {
        if (sendAmount > 0 && sendToAddress && gasPriceInGwei >= 1) {
            if (sendAmount > $scope.totalBalance) {
                // todo show message
                return;
            }

            console.log("generateTokenRawTransaction", sendToAddress, sendAmount, EthUnits.unitToUnit(gasPriceInGwei, 'gwei', 'wei'))

            let txGenPromise = WalletService.generateTokenRawTransaction(
                sendToAddress,
                sendAmount,
                EthUnits.unitToUnit(gasPriceInGwei, 'gwei', 'wei'),
                150000, //$scope.infoData.gasLimit,
                $scope.symbol.toUpperCase()
            )

            txGenPromise.then((signedHex) => {
                console.log(">>>> signedHex >>>>>", signedHex);

                $scope.sendPromise = Web3Service.sendRawTransaction(signedHex);
                $scope.sendPromise.then((resp) => {
                    console.log(">>>> sendPromise >>>>>", resp);
                    $scope.txHex = resp.transactionHash;
                    startTxCheck();
                    $scope.viewStates.step = 'transaction-status';
                }).catch((error) => {
                    $scope.errors.sendFailed = error.toString();
                    // reset view state
                    setViewState();
                });
            }).catch((error)=>{
                $scope.errors.sendFailed = error.toString();
                // reset view state
                setViewState();
            });
        }
    }

    function isNumeric(num){
        num = "" + num; //coerce num to be a string
        return !isNaN(num) && !isNaN(parseFloat(num));
    }

    function setViewState (state) {
        switch (state) {
            case 'sending':
                $scope.inputStates.isAddressLocked = true;
                $scope.inputStates.isAmountLocked = true;
                $scope.inputStates.isGasPriceLocked = true;
                $scope.backgroundProcessStatuses.txInProgress = true;
                $scope.backgroundProcessStatuses.checkingTransaction = true;
                $scope.errors.sendFailed = false;
            break;
            case 'before-send':
                $scope.viewStates.showConfirmButtons = false
                $scope.inputStates.isAddressLocked = true;
                $scope.inputStates.isAmountLocked = true;
                $scope.inputStates.isGasPriceLocked = true;
            break;
            default:
                $scope.inputStates.isAddressLocked = false;
                $scope.inputStates.isAmountLocked = false;
                $scope.inputStates.isGasPriceLocked = false;
                $scope.backgroundProcessStatuses.txInProgress = false;
                $scope.backgroundProcessStatuses.checkingTransaction = false;
                $scope.viewStates.showConfirmButtons = false;
        }

    }

    function getBalanceInUsd(balance) {
        console.log(balance, $scope.infoData.usdPerUnit);
        return (Number(balance) * Number($scope.infoData.usdPerUnit));
    }
    
    
    /**
     * 
     */
    let checkEstimatedGasInterval = $interval(() => {
        if (!estimatedGasNeedsCheck) return;

        $scope.backgroundProcessStatuses.checkingEstimatedGasLimit = true;

        if ($scope.formData.sendAmount && $scope.formData.sendToAddressHex && web3Utils.isHex($scope.formData.sendToAddressHex) && web3Utils.isAddress(web3Utils.toChecksumAddress($scope.formData.sendToAddressHex))) {
            
            let wei = web3Utils.toWei($scope.formData.sendAmount.toString());

            let promise = Web3Service.getEstimateGas(
                $rootScope.wallet.getPublicKeyHex(),
                $scope.formData.sendToAddressHex,
                web3Utils.numberToHex(wei)
            );

            promise.then((gasLimit) => {
                console.log("getEstimateGas gasLimit", gasLimit);
                $scope.infoData.gasLimit = gasLimit;

                $scope.infoData.isReady = true;
            }).catch((error) => {
                console.log("getEstimateGas", error);
            }).finally(() => {
                console.log(">???????")
                $scope.backgroundProcessStatuses.checkingEstimatedGasLimit = false;
            });

            estimatedGasNeedsCheck = false;
        }
    }, ESTIMATED_GAS_CHECK_INTERVAL);

    /**
     * 
     */
    $scope.$watch('formData', (newVal, oldVal) => {
        $log.info("formData", newVal);
        
        if(newVal.sendToAddressHex && (!web3Utils.isHex(newVal.sendToAddressHex) || !web3Utils.isAddress(web3Utils.toChecksumAddress(newVal.sendToAddressHex)))){
            $scope.errors.sendToAddressHex = true;
        } else {
            $scope.errors.sendToAddressHex = false;
        }
        
        if(newVal.sendAmount && !isNumeric(newVal.sendAmount)) {
            $scope.errors.sendAmount = true;
        } else {
            $scope.errors.sendAmount = false;
        }

        if (newVal.sendAmount && isNumeric(newVal.sendAmount)){
            // remining balance
            $scope.infoData.reminingBalance = Number($scope.infoData.totalBalance) - Number($scope.formData.sendAmount);

            // remining balance in USD
            $scope.infoData.reminingBalanceInUsd = Number($scope.infoData.reminingBalance) * Number($scope.infoData.usdPerUnit);

            // send amount in USD
            $scope.infoData.sendAmountInUSD = Number($scope.formData.sendAmount) * Number($scope.infoData.usdPerUnit);

            // tx fee in eth
            let wei = Number($scope.formData.gasPriceInGwei) * Number($scope.infoData.gasLimit);
            $scope.infoData.txFeeInEth = EthUnits.toEther(wei, 'wei');

            // tx fee in USD
            $scope.infoData.txFeeInUsd = Number($scope.infoData.txFeeInEth) * Number($scope.infoData.usdPerUnit);
        }

        if (newVal.sendAmount && isNumeric(newVal.sendAmount) && newVal.sendToAddressHex && web3Utils.isHex(newVal.sendToAddressHex) && web3Utils.isAddress(web3Utils.toChecksumAddress(newVal.sendToAddressHex))) {
            estimatedGasNeedsCheck = true;

            $scope.errors.sendAmount = false;
            $scope.errors.sendToAddressHex = false;
        }
    }, true);

    $scope.$on('$destroy', () => {
        cancelTxCheck();
        cancelEstimatedGasCheck();
    });
};

export default SendTokenDialogController;




