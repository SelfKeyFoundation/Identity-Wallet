'use strict';

const EthUnits = require('../../../classes/eth-units');
const EthUtils = require('../../../classes/eth-utils');

function SendTokenDialogController($rootScope, $scope, $log, $q, $mdDialog, $interval, $window, CONFIG, $state, $stateParams, Web3Service, CommonService, SqlLiteService) {
    'ngInject'
    let args = {
        symbol: $stateParams.symbol,
        allowSelectERC20Token: $stateParams.allowSelectERC20Token
    };
    
    $log.info("SendTokenDialogController", args, CONFIG);
    const web3Utils = Web3Service.constructor.web3.utils;
    const TX_CHECK_INTERVAL = 1000;
    const ESTIMATED_GAS_CHECK_INTERVAL = 300;

    let txInfoCheckInterval = null;
    let checkEstimatedGasInterval = null;
    let estimatedGasNeedsCheck = false;

    $scope.getTokenTitleBySymbol = (symbol) => {
        symbol = symbol.toUpperCase();
        let token = $rootScope.wallet.tokens[symbol];
        let tokenPrice = SqlLiteService.getTokenPriceBySymbol(token.symbol);

        const tokenNameExceptions = {
            'KEY': 'SelfKey'
        };
        let getTokenName = () => {
            return tokenNameExceptions[symbol] || tokenPrice.name;
        };
        return (tokenPrice ? (getTokenName() + ' - ') : '') + token.getBalanceDecimal() + ' ' + token.symbol;
    }

    /**
     * Prepare
     */
    prepare(args.symbol);

    /**
     *
     */
    startEstimatedGasCheck();

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
        if (!confirm) {
            setViewState('before-send');
        } else {
            setViewState('sending');
            if ($scope.symbol && $scope.symbol.toLowerCase() === 'eth') {
                sendEther($scope.formData.sendToAddressHex, $scope.formData.sendAmount, $scope.formData.gasPriceInGwei);
            } else {
                sendToken($scope.formData.sendToAddressHex, $scope.formData.sendAmount, $scope.formData.gasPriceInGwei);
            }
        }
    }

    $scope.getTransactionStatus = () => {
        if ($scope.errors.sendFailed) return $scope.errors.sendFailed;

        if (!$scope.backgroundProcessStatuses.txStatus && !$scope.txHex) {
            return 'Pending';
        } else if (!$scope.backgroundProcessStatuses.txStatus && $scope.txHex) {
            return 'Processing';
        } else {
            return $scope.backgroundProcessStatuses.txStatus ? 'Sent!' : 'Failed!';
        }
    }

    $scope.cancel = (event) => {
        cancelEstimatedGasCheck();
        cancelTxCheck();
        
        if (!args.symbol) {
            $state.go('member.dashboard.main');
        } else {
            $state.go('member.wallet.manage-token', { id: args.symbol });
        }
    }

    $scope.getTxFee = () => {
        let wei = Number($scope.formData.gasPriceInGwei) * Number($scope.infoData.gasLimit);
        return EthUnits.toEther(wei, 'wei');
    };

    $scope.checkTransaction = (event) => {
        if (!$scope.txHex) return;
        // TODO read endpoint from config
        $window.open("https://etherscan.io/tx/" + $scope.txHex);
    }

    $scope.onTokenChange = (newTokenKey) => {
        /*
        if(newTokenKey === 'Choose a Token.'){
            $scope.formData.sendToAddressHex = '';
            return;
        }
        */
        prepare(newTokenKey);
    }

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
                    $scope.backgroundProcessStatuses.txStatus = Number(txInfo.status);
                    $interval.cancel(txInfoCheckInterval);
                }
            }).catch((error) => {
                cancelTxCheck();
            });
        }, TX_CHECK_INTERVAL);
    }

    function cancelTxCheck() {
        if (txInfoCheckInterval) {
            $interval.cancel(txInfoCheckInterval);
        }
    }

    function startEstimatedGasCheck() {
        cancelEstimatedGasCheck();

        checkEstimatedGasInterval = $interval(() => {
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
                    $scope.infoData.gasLimit = gasLimit;
                    $scope.infoData.isReady = true;
                }).catch((error) => {
                    $log.error("getEstimateGas", error);
                }).finally(() => {
                    $scope.backgroundProcessStatuses.checkingEstimatedGasLimit = false;
                });

                estimatedGasNeedsCheck = false;
            }
        }, ESTIMATED_GAS_CHECK_INTERVAL);
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

            let txGenPromise = $rootScope.wallet.generateRawTransaction(
                sendToAddress,
                EthUnits.unitToUnit(sendAmount, 'ether', 'wei'),
                EthUnits.unitToUnit(gasPriceInGwei, 'gwei', 'wei'),
                $scope.infoData.gasLimit,
                null,
                CONFIG.chainId
            );

            txGenPromise.then((signedHex) => {
                $scope.sendPromise = Web3Service.sendRawTransaction(signedHex);
                $scope.sendPromise.then((resp) => {
                    $scope.txHex = resp.transactionHash;

                    $scope.viewStates.step = 'transaction-status';

                    startTxCheck();
                }).catch((error) => {
                    error = error.toString();
                    CommonService.showToast('error', error, 20000);
                    $scope.errors.sendFailed = error;
                    // reset view state
                    setViewState();
                });
            }).catch((error) => {
                error = error.toString();
                if (error) {
                    CommonService.showToast('error', error, 20000);
                }

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

            let txGenPromise = $rootScope.wallet.tokens[$scope.symbol].generateRawTransaction(
                sendToAddress,
                sendAmount,
                EthUnits.unitToUnit(gasPriceInGwei, 'gwei', 'wei'),
                60000,   // $scope.infoData.gasLimit
                $scope.symbol.toUpperCase(),
                CONFIG.chainId
            );

           
            txGenPromise.then((signedHex) => {
                $scope.sendPromise = Web3Service.sendRawTransaction(signedHex);
                $scope.sendPromise.then((resp) => {
                    $scope.txHex = resp.transactionHash;
                    startTxCheck();
                }).catch((error) => {
                    error = error.toString();
                    if (error.indexOf('Insufficient funds') == -1) {
                        CommonService.showToast('error', error, 20000);
                    }

                    $scope.errors.sendFailed = error;
                    // reset view state
                    setViewState();
                });

                $scope.viewStates.step = 'transaction-status';
            }).catch((error) => {
                error = error.toString();
                if (error == 'invalid_address') {
                    $scope.errors.sendToAddressHex = true;
                    setViewState();
                    return;
                }
                if (error) {
                    CommonService.showToast('error', error, 20000);
                }
                $scope.errors.sendFailed = error;
                // reset view state
                setViewState();
            });
        }
    }

    function isNumeric(num) {
        num = "" + num; //coerce num to be a string
        return !isNaN(num) && !isNaN(parseFloat(num));
    }

    function setViewState(state) {
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
        return (Number(balance) * Number($scope.infoData.usdPerUnit));
    }

    function calculateSendAmountInUSD() {
        // send amount in USD
        $scope.infoData.sendAmountInUSD = Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Number($scope.formData.sendAmount) * Number($scope.infoData.usdPerUnit));
    }

    function calculateReminingBalance() {
        // remining balance
        $scope.infoData.reminingBalance = Number($scope.infoData.totalBalance) - Number($scope.formData.sendAmount);

        // remining balance in USD
        $scope.infoData.reminingBalanceInUsd = Number($scope.infoData.reminingBalance) * Number($scope.infoData.usdPerUnit);
    }

    function prepare(symbol) {

        $scope.invalidData = false;
        $scope.symbol = symbol || '0';
        $scope.allowSelectERC20Token = args.allowSelectERC20Token;

        /**
         * form data
         */
        //if(!$scope.formData || !$scope.formData.sendToAddressHex){
        $scope.formData = $scope.formData || {};
        $scope.formData.sendAmount = args && args.sendAmount || null;
        $scope.formData.gasPriceInGwei = args && args.gasPriceInGwei || 5;
        //} else {
        //    $scope.formData.sendAmount = null;
        //    $scope.formData.gasPriceInGwei = 5;
        //}

        /**
         * informational data
         */
        $scope.infoData = {
            isReady: false,
            usdPerUnit: 0,

            sendAmountInUSD: 0.00,

            totalBalance: 0,
            totalBalanceInUsd: 0,

            reminingBalance: 0,
            reminingBalanceInUsd: 0,

            gasLimit: args.gasLimit || 21000,

            txFeeInEth: 0,
            txFeeInUsd: 0
        };

        /**
         *
         */
        $scope.backgroundProcessStatuses = {
            checkingTransaction: false,
            checkingEstimatedGasLimit: false
        };

        /**
         * input states
         */
        $scope.inputStates = {
            isAddressLocked: args.isAddressLocked,
            isAmountLocked: args.isAmountLocked,
            isGasPriceLocked: args.isGasPriceLocked
        };

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

        if ($scope.symbol && $scope.symbol.toLowerCase() === 'eth') {
            $scope.infoData.usdPerUnit = $rootScope.wallet.usdPerUnit;
            $scope.infoData.totalBalance = $rootScope.wallet.balanceEth;
        } else {
            let token = $rootScope.wallet.tokens[$scope.symbol];
            if (token) {
                $scope.infoData.usdPerUnit = token.usdPerUnit;
                $scope.infoData.totalBalance = token.getBalanceDecimal();
                calculateReminingBalance();
            }
        }
    }

    /**
     *
     */
    $scope.$watch('formData', (newVal, oldVal) => {
        $log.info("formData", newVal);

        if (newVal.sendAmount && !isNumeric(newVal.sendAmount)) {
            $scope.errors.sendAmount = true;
        } else {
            $scope.errors.sendAmount = false;

            // allow only decimals for non eth items
            if ($scope.symbol && $scope.symbol.toLowerCase() !== 'eth') {
                newVal.sendAmount = Number(newVal.sendAmount);
            }

            if (Number(newVal.sendAmount) > $scope.infoData.totalBalance) {
                $scope.formData.sendAmount = $scope.infoData.totalBalance;
            }

            if (Number(newVal.sendAmount) < 0) {
                $scope.formData.sendAmount = 0;
            }
        }

        if (newVal.sendToAddressHex && (!web3Utils.isHex(newVal.sendToAddressHex) || !web3Utils.isAddress(web3Utils.toChecksumAddress(newVal.sendToAddressHex)))) {
            $scope.errors.sendToAddressHex = true;
        } else {
            $scope.errors.sendToAddressHex = false;
        }

        if (newVal.sendAmount && isNumeric(newVal.sendAmount)) {
            calculateReminingBalance();

            calculateSendAmountInUSD();


            // tx fee in eth
            let wei = Number($scope.formData.gasPriceInGwei) * Number($scope.infoData.gasLimit);
            $scope.infoData.txFeeInEth = EthUnits.toEther(wei, 'wei');

            // tx fee in USD
            $scope.infoData.txFeeInUsd = Number($scope.infoData.txFeeInEth) * Number($scope.infoData.usdPerUnit);
        }

        if (newVal.sendAmount && isNumeric(newVal.sendAmount) && newVal.sendToAddressHex && web3Utils.isHex(newVal.sendToAddressHex) && web3Utils.isAddress(web3Utils.toChecksumAddress(newVal.sendToAddressHex))) {
            if (!args.gasLimit) {
                estimatedGasNeedsCheck = true;
            } else {
                $scope.infoData.isReady = true;
            }

            $scope.errors.sendAmount = false;
            $scope.errors.sendToAddressHex = false;
        }
    }, true);

    $scope.$on('$destroy', () => {
        cancelTxCheck();
        cancelEstimatedGasCheck();
    });
};
SendTokenDialogController.$inject = ["$rootScope", "$scope", "$log", "$q", "$mdDialog", "$interval", "$window", "CONFIG", "$state", "$stateParams", "Web3Service", "CommonService", "SqlLiteService"];
module.exports = SendTokenDialogController;
