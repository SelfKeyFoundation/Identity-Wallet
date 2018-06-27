'use strict';

const CommonUtils = require('./common-utils');
const EthUtils = require('./eth-utils');

let $rootScope, $q, $interval, SqlLiteService, Web3Service, CommonService, SignService;

let priceUpdaterInterval, balanceUpdaterInterval;

class Token {
	/**
	 *
	 */
	static get balanceHex() {
		return '0x70a08231';
	}
	static get transferHex() {
		return '0xa9059cbb';
	}

	static set $rootScope(value) {
		$rootScope = value;
	}
	static set $q(value) {
		$q = value;
	}
	static set $interval(value) {
		$interval = value;
	}
	static set SqlLiteService(value) {
		SqlLiteService = value;
	}
	static set Web3Service(value) {
		Web3Service = value;
	}
	static set CommonService(value) {
		CommonService = value;
	}
	static set SignService(value) {
		SignService = value;
	}

	/**
	 *
	 * @param {*} contractAddress
	 * @param {*} symbol
	 * @param {*} decimal
	 * @param {*} wallet
	 */
	constructor(contractAddress, symbol, decimal, isCustom, id, walletTokenId, hidden, wallet) {
		this.contractAddress = contractAddress;
		this.symbol = symbol;
		this.decimal = decimal;
		this.isCustom = isCustom;
		this.id = id;
		this.walletTokenId = walletTokenId;
		this.balanceHex = null;
		this.balanceDecimal = 0;
		this.hidden = hidden;

		this.balanceInUsd = 0;
		this.usdPerUnit = 0;

		this.wallet = wallet;

		this.updatePriceInUSD();

		this.startPriceUpdater();
		this.startBalanceUpdater();

		this.initialBalancePromise = this.loadBalance();
	}

	static generateContractData(toAdd, value, decimal) {
		try {
			if (!EthUtils.validateEtherAddress(toAdd)) return { error: 'invalid_address' };
			if (!CommonUtils.isNumeric(value) || parseFloat(value) < 0)
				return { error: 'invalid_value' };
			value = EthUtils.padLeft(
				new BigNumber(value).times(new BigNumber(10).pow(decimal)).toString(16),
				64
			);
			toAdd = EthUtils.padLeft(EthUtils.getNakedAddress(toAdd), 64);
			return { error: null, data: Token.transferHex + toAdd + value };
		} catch (e) {
			return { error: e, data: null };
		}
	}

	isHidden() {
		return this.hidden;
	}

	setIsHidden(isHidden) {
		this.hidden = isHidden;
	}

	/**
	 *
	 */
	getFormattedBalance() {
		return CommonService.commasAfterNumber(this.getBalanceDecimal());
	}

	getBalanceDecimal() {
		return new BigNumber(this.balanceDecimal)
			.div(new BigNumber(10).pow(this.decimal))
			.toString();
	}

	getBalanceInUSD() {
		return this.balanceInUsd;
	}

	getFormattedBalanceInUSD() {
		return CommonService.getFormattedValueUSD(this.balanceInUsd);
	}

	generateContractData(toAddress, value) {
		return Token.generateContractData(toAddress, value, this.decimal);
	}

	static generateBalanceData(contractAddress, walletPublicKeyHex) {
		contractAddress = contractAddress || this.contractAddress;
		walletPublicKeyHex = walletPublicKeyHex || this.wallet.getPublicKeyHex();
		return EthUtils.getDataObj(contractAddress, Token.balanceHex, [
			EthUtils.getNakedAddress(walletPublicKeyHex)
		]);
	}

	loadBalance() {
		let defer = $q.defer();

		let data = Token.generateBalanceData.bind(this).call();
		let promise = Web3Service.getTokenBalanceByData(data);

		promise
			.then(balanceHex => {
				let oldBalanceHex = angular.copy(this.balanceHex);

				this.balanceHex = balanceHex;
				this.balanceDecimal = EthUtils.hexToDecimal(balanceHex);

				this.calculateBalanceInUSD();
				if (balanceHex !== oldBalanceHex) {
					$rootScope.$broadcast(
						'balance:change',
						this.symbol,
						this.getBalanceDecimal(),
						this.balanceInUsd
					);
				}

				defer.resolve(this);
			})
			.catch(error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	static getBalanceByContractAddress(contractAddress, walletPublicKeyHex) {
		let defer = $q.defer();
		let data = Token.generateBalanceData(contractAddress, walletPublicKeyHex);
		let promise = Web3Service.getTokenBalanceByData(data);

		promise
			.then(balanceHex => {
				let balanceDecimal = EthUtils.hexToDecimal(balanceHex);

				defer.resolve(balanceDecimal);
			})
			.catch(error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	setPriceInUsd(usdPerUnit) {
		this.usdPerUnit = usdPerUnit;
		this.calculateBalanceInUSD();
	}

	getBalanceInUsd() {
		return this.balanceInUsd;
	}

	calculateBalanceInUSD() {
		this.balanceInUsd = Number(this.getBalanceDecimal()) * Number(this.usdPerUnit);
		this.wallet.calculateTotalBalanceInUSD();
		return this.balanceInUsd;
	}

	updatePriceInUSD() {
		let price = SqlLiteService.getTokenPriceBySymbol(this.symbol);
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
		}, 5000);
	}

	cancelPriceUpdater() {
		$interval.cancel(priceUpdaterInterval);
	}

	startBalanceUpdater() {
		balanceUpdaterInterval = $interval(() => {
			this.loadBalance();
		}, 30000);
	}

	cancelBalanceUpdater() {
		$interval.cancel(balanceUpdaterInterval);
	}

	/**
	 *
	 * @param {*} toAddressHex
	 * @param {*} valueWei
	 * @param {*} gasPriceWei
	 * @param {*} gasLimitWei
	 * @param {*} chainID
	 */
	generateRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, chainID) {
		let defer = $q.defer();
		let promise = Web3Service.getTransactionCount('0x' + this.wallet.getPublicKeyHex());
		promise
			.then(nonce => {
				$rootScope.wallet.getPreviousTransactionCount().then(previousTransactionCount => {
					if (
						typeof previousTransactionCount == 'number' &&
						nonce <= previousTransactionCount
					) {
						return defer.reject('SAME_TRANSACTION_COUNT_CUSTOM_MSG');
					}

					$rootScope.previousTransactionCount = +nonce;

					let genResult = this.generateContractData(toAddressHex, valueWei);
					if (genResult.error) {
						defer.reject(genResult.error);
					} else {
						let rawTx = {
							nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
							gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
							gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
							to: EthUtils.sanitizeHex(this.contractAddress),
							value: '0x00',
							data: EthUtils.sanitizeHex(genResult.data),
							chainId: chainID
						};

						let isLedgerWallet = $rootScope.wallet.profile == 'ledger';
						if (isLedgerWallet) {
							$rootScope.openConfirmLedgerTxInfoWindow();
						}

						SignService.signTransaction({
							rawTx: rawTx,
							profile: this.wallet.profile,
							privateKey: this.wallet.privateKey,
							walletAddress: '0x' + this.wallet.getPublicKeyHex()
						})
							.then(res => {
								defer.resolve(res);
							})
							.catch(err => {
								defer.reject(err);
							});
					}
				});
			})
			.catch(error => {
				defer.reject(error);
			});

		return defer.promise;
	}
}

module.exports = Token;
