/* global BigNumber */
'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('custom-token-ctl');
const Token = require('../../../classes/token');

function AddCustomTokenDialogController(
	$rootScope,
	$scope,
	$q,
	$timeout,
	$mdDialog,
	SqlLiteService,
	Web3Service,
	CommonService
) {
	'ngInject';

	log.info('AddCustomTokenDialogController');

	$scope.cancel = event => {
		$mdDialog.cancel();
	};

	$scope.inProgress = false;
	$scope.formDataIsValid = form => {
		return form.$valid;
	};

	let tokens = SqlLiteService.getTokens() || {};
	let tokenKeys = Object.keys(tokens);
	let allTokensArr = tokenKeys.map(key => {
		return tokens[key];
	});

	let getTokenByContractAddress = contractAddress => {
		return allTokensArr.find(token => {
			return token.address.toLowerCase() === contractAddress.toLowerCase();
		});
	};

	let getExistingTokenByAddress = address => {
		address = address.toLowerCase();
		let tokenKey = Object.keys(wallet.tokens).find(
			key => wallet.tokens[key].contractAddress.toLowerCase() === address
		);
		return tokenKey ? wallet.tokens[tokenKey.toUpperCase()] : null;
	};

	let wallet = $rootScope.wallet;
	const web3Utils = Web3Service.constructor.web3.utils;
	const incorectTokenSymbolsMap = {
		latoken: 'LA',
		'٨': 'DCN'
	};

	let resetVariables = excludeDuplication => {
		$scope.tokenDoesNotExists = false;
		$scope.lookingContractIntoBlockain = false;
		if (!excludeDuplication) {
			$scope.duplicationErr = false;
		}
	};

	/**
	 *
	 */
	$scope.$watch(
		'formData.contractAddress',
		(newVal, oldVal) => {
			let data = $scope.formData;
			let check = false;
			resetVariables();
			try {
				check =
					newVal &&
					web3Utils.isHex(newVal) &&
					web3Utils.isAddress(web3Utils.toChecksumAddress(newVal));
			} catch (error) {
				log.error(error);
			}

			let isValidHex = newVal && check;

			let existingToken = isValidHex ? getExistingTokenByAddress(newVal) : null;
			if (existingToken) {
				$scope.duplicationErr = `${
					existingToken.symbol
				} token already exists. Please add a unique token and try again.`;

				return resetFormData(true);
			}

			if (isValidHex) {
				let existingToken = getTokenByContractAddress(newVal);

				if (existingToken) {
					data.symbol = existingToken.symbol;
					data.decimalPlaces = existingToken.decimal;
					data.tokenId = existingToken.id;
				} else {
					resetFormData();
					$scope.lookingContractIntoBlockain = true;
					Web3Service.getContractInfo(newVal)
						.then(responseArr => {
							if (!responseArr || responseArr.length !== 2) {
								return resetFormData();
							}

							let decimal = responseArr[0];
							let symbol = responseArr[1];

							if (incorectTokenSymbolsMap[symbol.toLowerCase()]) {
								symbol = incorectTokenSymbolsMap[symbol.toLowerCase()];
							}

							data.symbol = symbol;
							data.decimalPlaces = Number(decimal);
							data.tokenId = '';

							$scope.lookingContractIntoBlockain = false;
						})
						.catch(err => {
							log.error(err);
							resetFormData();
							$scope.tokenDoesNotExists = true;
						});
				}
			} else {
				resetFormData();
			}
		},
		true
	);

	$scope.formData = {
		decimalPlaces: null,
		symbol: '',
		contractAddress: '',
		tokenId: ''
	};

	let resetFormData = excludeDuplication => {
		let data = $scope.formData;

		data.symbol = '';
		data.decimalPlaces = null;
		data.tokenId = '';
		resetVariables(excludeDuplication);
	};
	$scope.addCustomToken = (event, form) => {
		if (!$scope.formDataIsValid(form)) {
			return CommonService.showToast('warning', 'Invalid token contract address.');
		}

		let newToken = $scope.formData;
		$scope.inProgress = true;

		Token.getBalanceByContractAddress(newToken.contractAddress, wallet.getPublicKeyHex())
			.then(balance => {
				let balanceValueDivider = new BigNumber(10 ** newToken.decimalPlaces);
				balance = new BigNumber(balance).div(balanceValueDivider);
				let newWalletToken = {
					walletId: wallet.id,
					tokenId: newToken.tokenId,
					balance: balance.toString()
				};

				let successFn = data => {
					let formatedBalance = CommonService.numbersAfterComma(balance, 2);

					let newToken = wallet.addNewToken(data.token);

					let loadTokensPromise = SqlLiteService.loadTokens();
					let loadWalletTokensPromise = SqlLiteService.loadWalletTokens(wallet.id);

					$q.all([
						loadWalletTokensPromise,
						newToken.initialBalancePromise,
						loadTokensPromise
					]).then(() => {
						$scope.inProgress = false;
						$scope.cancel();
						$rootScope.openNewERC20TokenInfoDialog(
							event,
							'New ERC-20 Token Added:',
							newToken.symbol,
							formatedBalance
						);
						CommonService.showToast('success', 'Added');
					});
				};

				let errFn = err => {
					$scope.inProgress = false;
					CommonService.showToast('error', err ? err.Error : 'Error');
				};

				if (newToken.tokenId) {
					SqlLiteService.insertWalletToken(newWalletToken)
						.then(successFn)
						.catch(errFn);
				} else {
					newWalletToken.symbol = newToken.symbol;
					newWalletToken.decimal = newToken.decimalPlaces;
					newWalletToken.address = newToken.contractAddress;
					newWalletToken.isCustom = 1;

					delete newWalletToken.tokenId;
					delete newWalletToken.balance;
					delete newWalletToken.walletId;
					SqlLiteService.insertNewWalletToken(
						newWalletToken,
						balance.toString(),
						wallet.id
					)
						.then(successFn)
						.catch(errFn);
				}
			})
			.catch(err => {
				$scope.inProgress = false;
				return CommonService.showToast('error', err ? err.Error : 'Error');
			});
	};
}

AddCustomTokenDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$q',
	'$timeout',
	'$mdDialog',
	'SqlLiteService',
	'Web3Service',
	'CommonService'
];

module.exports = AddCustomTokenDialogController;
