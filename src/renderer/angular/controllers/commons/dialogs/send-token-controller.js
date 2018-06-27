'use strict';

const EthUnits = require('../../../classes/eth-units');
const EthUtils = require('../../../classes/eth-utils');

function SendTokenDialogController(
	$rootScope,
	$scope,
	$log,
	$q,
	$mdDialog,
	$interval,
	$window,
	CONFIG,
	$state,
	$stateParams,
	Web3Service,
	CommonService,
	SqlLiteService,
	TxHistoryService
) {
	'ngInject';

	const TIMEOUT_ERROR = 'Endpoint request timed out';
	let args = {
		symbol: $stateParams.symbol,
		allowSelectERC20Token: $stateParams.allowSelectERC20Token
	};

	$log.info('SendTokenDialogController', args, CONFIG);
	const web3Utils = Web3Service.constructor.web3.utils;
	const TX_CHECK_INTERVAL = 1000;
	const ESTIMATED_GAS_CHECK_INTERVAL = 300;

	let txInfoCheckInterval = null;
	let checkEstimatedGasInterval = null;
	let estimatedGasNeedsCheck = false;

	let isLedgerWallet = $rootScope.wallet.profile == 'ledger';
	$scope.signedHex = null;
	let currentTxHistoryData = {};

	$scope.getTokenTitleBySymbol = symbol => {
		symbol = symbol.toUpperCase();
		let token = $rootScope.wallet.tokens[symbol];
		let tokenPrice = SqlLiteService.getTokenPriceBySymbol(token.symbol);

		const tokenNameExceptions = {
			KEY: 'SelfKey'
		};
		let getTokenName = () => {
			return tokenNameExceptions[symbol] || tokenPrice.name;
		};
		return (
			(tokenPrice ? getTokenName() + ' - ' : '') +
			token.getBalanceDecimal() +
			' ' +
			token.symbol
		);
	};

	let ledgerConnErrKeywords = ['invalid status 6700', 'invalid channel', 'device not found'];
	let isLedgerConnError = err => {
		if (!err) {
			return false;
		}
		err = err.toLowerCase();
		let check = false;
		ledgerConnErrKeywords.every(keyword => {
			if (err.indexOf(keyword) != -1) {
				check = true;
				return false; //break iteration
			}
			return true; //continue iteration
		});
		return check;
	};

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
	$scope.selectAll = event => {
		$scope.formData.sendAmount = angular.copy($scope.infoData.totalBalance);
	};

	$scope.startSend = event => {
		$scope.signedHex = null;
		let isEth = $scope.symbol && $scope.symbol.toLowerCase() === 'eth';
		let genRawTrPromise = generateRawTransaction(isEth);
		if (!genRawTrPromise) {
			return;
		}

		genRawTrPromise
			.then(signedHex => {
				$scope.signedHex = signedHex;
				$scope.viewStates.showConfirmButtons = true;
				$mdDialog.cancel();
			})
			.catch(error => {
				$mdDialog.cancel();
				let processedErr = false;
				error = error.toString();

				if (error == 'invalid_address') {
					$scope.errors.sendToAddressHex = true;
					setViewState();
					return;
				}

				if (error == 'SAME_TRANSACTION_COUNT_CUSTOM_MSG') {
					error = `Error: There is already another transaction on the Ethereum network with the same hash.
					 Please wait until this is complete before sending another transaction.`;
					$scope.errors.sendFailed = error;
					$scope.viewStates.step = 'transaction-status';
					setViewState();
					return;
				}

				if (isLedgerWallet) {
					if (error.indexOf('Invalid status 6801') != -1) {
						processedErr = true;
						$rootScope.openUnlockLedgerInfoWindow();
					} else if (error.indexOf('Invalid status 6985') != -1) {
						processedErr = true;
						$rootScope.openRejectLedgerTxWarningDialog();
					} else if (error == 'custom-timeout') {
						processedErr = true;
						$rootScope.openLedgerTimedOutWindow();
					} else if (isLedgerConnError(error)) {
						processedErr = true;
						let isSendingTxFealure = true;
						$rootScope.openConnectingToLedgerDialog(event, isSendingTxFealure);
					}
				}

				if (error.indexOf(TIMEOUT_ERROR) !== -1) {
					$scope.startSend(event);
					return;
				}

				if (error && !processedErr) {
					CommonService.showToast('error', error, 20000);
				}

				$scope.errors.sendFailed = !processedErr ? error : '';
				// reset view state
				setViewState();
			});
	};

	$scope.confirmSend = (event, confirm) => {
		if (!confirm) {
			setViewState('before-send');
		} else {
			setViewState('sending');
			send();
		}
	};

	$scope.getTransactionStatus = () => {
		if ($scope.errors.sendFailed) return $scope.errors.sendFailed;

		if (!$scope.backgroundProcessStatuses.txStatus && !$scope.txHex) {
			return 'Pending';
		} else if (!$scope.backgroundProcessStatuses.txStatus && $scope.txHex) {
			return 'Processing';
		} else {
			return $scope.backgroundProcessStatuses.txStatus ? 'Sent!' : 'Failed!';
		}
	};

	$scope.cancel = event => {
		cancelEstimatedGasCheck();
		cancelTxCheck();

		if (!args.symbol) {
			$state.go('member.dashboard.main');
		} else {
			$state.go('member.wallet.manage-token', { id: args.symbol });
		}
	};

	$scope.getTxFee = () => {
		let wei = Number($scope.formData.gasPriceInGwei) * Number($scope.infoData.gasLimit);
		return EthUnits.toEther(wei, 'wei');
	};

	$scope.checkTransaction = event => {
		if (!$scope.txHex) return;
		// TODO read endpoint from config
		$window.open('https://etherscan.io/tx/' + $scope.txHex);
	};

	$scope.onTokenChange = newTokenKey => {
		/*
        if(newTokenKey === 'Choose a Token.'){
            $scope.formData.sendToAddressHex = '';
            return;
        }
        */
		prepare(newTokenKey);
	};

	/**
	 *
	 */
	function startTxCheck() {
		cancelTxCheck();

		txInfoCheckInterval = $interval(() => {
			if (!$scope.txHex) return;

			let txInfoPromise = Web3Service.getTransactionReceipt($scope.txHex.toString());
			txInfoPromise
				.then(txInfo => {
					if (txInfo && txInfo.blockNumber !== null) {
						$scope.backgroundProcessStatuses.txStatus = Number(txInfo.status);
						$interval.cancel(txInfoCheckInterval);
					}
				})
				.catch(error => {
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

			if (
				$scope.formData.sendAmount &&
				$scope.formData.sendToAddressHex &&
				web3Utils.isHex($scope.formData.sendToAddressHex) &&
				web3Utils.isAddress(web3Utils.toChecksumAddress($scope.formData.sendToAddressHex))
			) {
				let wei = web3Utils.toWei($scope.formData.sendAmount.toString());

				let promise = Web3Service.getEstimateGas(
					$rootScope.wallet.getPublicKeyHex(),
					$scope.formData.sendToAddressHex,
					web3Utils.numberToHex(wei)
				);

				promise
					.then(gasLimit => {
						$scope.infoData.gasLimit = gasLimit;
						$scope.infoData.isReady = true;
					})
					.catch(error => {
						$log.error('getEstimateGas', error);
					})
					.finally(() => {
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

	// returns null on faild validation
	function generateRawTransaction(isEth) {
		let sendToAddress = $scope.formData.sendToAddressHex;
		let sendAmount = $scope.formData.sendAmount;
		let gasPriceInGwei = $scope.formData.gasPriceInGwei;

		// validation
		if (sendAmount > 0 && sendToAddress && gasPriceInGwei >= 1) {
			if (sendAmount > $scope.totalBalance) {
				// todo show message
				return null;
			}
		}

		let gasPrice = EthUnits.unitToUnit(gasPriceInGwei, 'gwei', 'wei');
		currentTxHistoryData = {
			to: sendToAddress,
			gasPrice: gasPrice,
			value: sendAmount
		};

		let txGenPromise = null;
		if (isEth) {
			txGenPromise = $rootScope.wallet.generateRawTransaction(
				sendToAddress,
				EthUnits.unitToUnit(sendAmount, 'ether', 'wei'),
				gasPrice,
				$scope.infoData.gasLimit,
				null,
				CONFIG.chainId
			);
		} else {
			//ERC20 token
			txGenPromise = $rootScope.wallet.tokens[$scope.symbol].generateRawTransaction(
				sendToAddress,
				sendAmount,
				gasPrice,
				60000, // $scope.infoData.gasLimit
				$scope.symbol.toUpperCase(),
				CONFIG.chainId
			);

			currentTxHistoryData.tokenSymbol = $scope.symbol.toUpperCase();
		}
		return txGenPromise;
	}

	function send() {
		if (!$scope.signedHex) {
			// reset view state
			setViewState();
			return;
		}
		$scope.viewStates.step = 'transaction-status';
		$scope.sendPromise = Web3Service.sendRawTransaction($scope.signedHex);

		TxHistoryService.insertPandingTx($scope.sendPromise, currentTxHistoryData);

		$scope.sendPromise
			.then(transactionHash => {
				$scope.txHex = transactionHash;
				$rootScope.wallet.updatePreviousTransactionCount();
				startTxCheck();
			})
			.catch(error => {
				error = error.toString();
				if (error.indexOf('Insufficient funds') == -1) {
					CommonService.showToast('error', error, 20000);
				} else if (error.indexOf(TIMEOUT_ERROR) !== -1) {
					send();
					return;
				}
				$scope.errors.sendFailed = error;
				// reset view state
				setViewState();
			});
	}

	function isNumeric(num) {
		num = '' + num; //coerce num to be a string
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
				$scope.viewStates.showConfirmButtons = false;
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
		return Number(balance) * Number($scope.infoData.usdPerUnit);
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
		$scope.infoData.reminingBalance =
			Number($scope.infoData.totalBalance) - Number($scope.formData.sendAmount);

		// remining balance in USD
		$scope.infoData.reminingBalanceInUsd =
			Number($scope.infoData.reminingBalance) * Number($scope.infoData.usdPerUnit);
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
		$scope.formData.sendAmount = (args && args.sendAmount) || null;
		$scope.formData.gasPriceInGwei = (args && args.gasPriceInGwei) || 5;
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

			sendAmountInUSD: 0.0,

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
		};

		/**
		 *
		 */
		$scope.errors = {
			sendToAddressHex: false,
			sendAmount: false,
			sendFailed: false
		};

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
	$scope.$watch(
		'formData',
		(newVal, oldVal) => {
			$log.info('formData', newVal);

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

			if (
				newVal.sendToAddressHex &&
				(!web3Utils.isHex(newVal.sendToAddressHex) ||
					!web3Utils.isAddress(web3Utils.toChecksumAddress(newVal.sendToAddressHex)))
			) {
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
				$scope.infoData.txFeeInUsd =
					Number($scope.infoData.txFeeInEth) * Number($scope.infoData.usdPerUnit);
			}

			if (
				newVal.sendAmount &&
				isNumeric(newVal.sendAmount) &&
				newVal.sendToAddressHex &&
				web3Utils.isHex(newVal.sendToAddressHex) &&
				web3Utils.isAddress(web3Utils.toChecksumAddress(newVal.sendToAddressHex))
			) {
				if (!args.gasLimit) {
					estimatedGasNeedsCheck = true;
				} else {
					$scope.infoData.isReady = true;
				}

				$scope.errors.sendAmount = false;
				$scope.errors.sendToAddressHex = false;
			}
		},
		true
	);

	$scope.$on('$destroy', () => {
		cancelTxCheck();
		cancelEstimatedGasCheck();
	});

	$rootScope.$on('tx-sign:retry', event => {
		$mdDialog.cancel();
		$scope.startSend(event);
	});
}

SendTokenDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$q',
	'$mdDialog',
	'$interval',
	'$window',
	'CONFIG',
	'$state',
	'$stateParams',
	'Web3Service',
	'CommonService',
	'SqlLiteService',
	'TxHistoryService'
];

module.exports = SendTokenDialogController;
