'use strict';

const EthUnits = require('./eth-units');
const EthUtils = require('./eth-utils');
const Token = require('./token');

let $rootScope,
	$q,
	$interval,
	Web3Service,
	CommonService,
	ElectronService,
	SqlLiteService,
	SignService,
	$log;

let readyToShowNotification = false;

let priceUpdaterInterval,
	loadBalanceInterval = null;

class Wallet {
	static set $rootScope(value) {
		$rootScope = value;
	}
	static set $q(value) {
		$q = value;
	}
	static set $interval(value) {
		$interval = value;
	}
	static set Web3Service(value) {
		Web3Service = value;
	}
	static set CommonService(value) {
		CommonService = value;
	}
	static set ElectronService(value) {
		ElectronService = value;
	} // TODO remove (use RPCService instead)
	static set SqlLiteService(value) {
		SqlLiteService = value;
	}

	static set SignService(value) {
		SignService = value;
	}
	static set $log(value) {
		$log = value;
	}

	constructor(id, privateKey, publicKey, keystoreFilePath, profile) {
		this.id = id;
		this.keystoreFilePath = keystoreFilePath;
		this.profile = profile;

		this.privateKey = privateKey;
		this.privateKeyHex = privateKey ? privateKey.toString('hex') : null;

		this.publicKey = publicKey;
		this.publicKeyHex = publicKey ? publicKey.toString('hex') : null;

		this.balanceWei = 0;
		this.balanceEth = 0;

		this.balanceInUsd = 0;
		this.usdPerUnit = 0;

		this.totalBalanceInUSD = 0;

		this.tokens = {};
		this.idAttributes = {};
		this.hasJustActivated = false;

		this.updatePriceInUSD();

		this.startPriceUpdater();
		this.startBalanceUpdater();

		this.initialBalancePromise = this.loadBalance();

		this.loadTokens();
	}

	getPrivateKey() {
		return this.privateKey;
	}

	getPrivateKeyHex() {
		return this.privateKeyHex;
	}

	getBalanceInUsd() {
		return this.balanceInUsd;
	}

	getPublicKey() {
		return this.publicKey;
	}

	getPublicKeyHex() {
		return this.publicKeyHex;
	}

	loadBalance() {
		let defer = $q.defer();
		let promise = Web3Service.getBalance('0x' + this.getPublicKeyHex());

		promise
			.then(balanceWei => {
				let oldBalanceInWei = angular.copy(this.balanceWei);

				this.balanceEth = EthUnits.toEther(balanceWei, 'wei');
				this.balanceEth = Number(CommonService.numbersAfterComma(this.balanceEth, 8));
				this.balanceWei = balanceWei;

				this.calculateBalanceInUSD();
				if (balanceWei !== oldBalanceInWei) {
					$rootScope.$broadcast(
						'balance:change',
						'eth',
						this.balanceEth,
						this.balanceInUsd
					);
					if (readyToShowNotification) {
						ElectronService.showNotification(
							'ETH Balance Changed',
							'New Balance: ' + this.balanceEth
						);
					}
				}

				readyToShowNotification = true;

				defer.resolve(this);
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

	calculateBalanceInUSD() {
		this.balanceInUsd = Number(this.balanceEth) * Number(this.usdPerUnit);
		this.calculateTotalBalanceInUSD();
		return this.balanceInUsd;
	}

	calculateTotalBalanceInUSD() {
		this.totalBalanceInUSD = this.balanceInUsd;
		for (let i in this.tokens) {
			let token = this.tokens[i];

			this.totalBalanceInUSD += token.balanceInUsd;
		}
		return this.totalBalanceInUSD;
	}

	getFormattedBalance() {
		return this.balanceEth;
	}

	getBalanceInUSD() {
		return this.balanceInUsd;
	}

	getFormattedBalanceInUSD() {
		return CommonService.getFormattedValueUSD(this.balanceInUsd);
	}

	getFormattedTokenBalanceInUSD(symbol) {
		let token = this.tokens[symbol.toUpperCase()];
		return token ? token.getFormattedBalanceInUSD() : 0;
	}

	getFormatedTotalBalanceInUSD() {
		return CommonService.numbersAfterComma(this.totalBalanceInUSD, 2);
	}

	updatePriceInUSD() {
		let price = SqlLiteService.getTokenPriceBySymbol('ETH');
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
		loadBalanceInterval = $interval(() => {
			this.loadBalance();
		}, 30000);
	}

	cancelBalanceUpdater() {
		$interval.cancel(loadBalanceInterval);
	}

	/**
	 * tokens
	 */
	loadTokens() {
		let defer = $q.defer();
		SqlLiteService.loadWalletTokens(this.id)
			.then(walletTokens => {
				this.tokens = {};
				for (let i in walletTokens) {
					let token = walletTokens[i];
					this.tokens[token.symbol.toUpperCase()] = this.addNewToken(token);
				}
				defer.resolve(this.tokens);
			})
			.catch(error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	addNewToken(data) {
		let newToken = new Token(
			data.address,
			data.symbol,
			data.decimal,
			data.isCustom,
			data.tokenId,
			data.id,
			data.hidden,
			this
		);
		this.tokens[data.symbol.toUpperCase()] = newToken;
		return newToken;
	}

	/**
	 * ID Attributes
	 */
	loadIdAttributes() {
		let defer = $q.defer();

		SqlLiteService.loadIdAttributes(this.id)
			.then(idAttributes => {
				this.idAttributes = {};

				for (let i in idAttributes) {
					this.idAttributes[idAttributes[i].idAttributeType] = idAttributes[i];
				}

				defer.resolve(this.idAttributes);
			})
			.catch(error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	getIdAttributes() {
		return this.idAttributes;
	}

	// temporary method - while we support only *ONE* item/value per attribute
	getIdAttributeItemValue(idAttributeTypeKey, line) {
		if (
			this.idAttributes[idAttributeTypeKey] &&
			this.idAttributes[idAttributeTypeKey].items &&
			this.idAttributes[idAttributeTypeKey].items.length &&
			this.idAttributes[idAttributeTypeKey].items[0].values &&
			this.idAttributes[idAttributeTypeKey].items[0].values.length
		) {
			return (
				this.idAttributes[idAttributeTypeKey].items[0].values[0].staticData[line] ||
				this.idAttributes[idAttributeTypeKey].items[0].values[0].documentId
			);
		}
	}

	/**
	 *
	 * @param {*} toAddressHex
	 * @param {*} valueWei
	 * @param {*} gasPriceWei
	 * @param {*} gasLimitWei
	 * @param {*} contractDataHex
	 * @param {*} chainID
	 */
	generateRawTransaction(
		toAddressHex,
		valueWei,
		gasPriceWei,
		gasLimitWei,
		contractDataHex,
		chainID,
		previousDefer
	) {
		let defer = previousDefer ? previousDefer : $q.defer();

		let promise = Web3Service.getTransactionCount(this.getPublicKeyHex());
		promise
			.then(nonce => {
				//wallet.nonceHex
				this.getPreviousTransactionCount().then(previousTransactionCount => {
					if (
						typeof previousTransactionCount == 'number' &&
						nonce <= previousTransactionCount
					) {
						return defer.reject('SAME_TRANSACTION_COUNT_CUSTOM_MSG');
					}

					$rootScope.previousTransactionCount = +nonce;

					let rawTx = {
						nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
						gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
						gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
						to: EthUtils.sanitizeHex(toAddressHex),
						value: EthUtils.sanitizeHex(EthUtils.decimalToHex(valueWei)),
						chainId: chainID || 3 // if missing - use ropsten testnet
					};

					if (contractDataHex) {
						rawTx.data = EthUtils.sanitizeHex(contractDataHex);
					}

					let isLedgerWallet = $rootScope.wallet.profile == 'ledger';
					if (isLedgerWallet) {
						$rootScope.openConfirmLedgerTxInfoWindow();
					}

					SignService.signTransaction({
						profile: this.profile,
						rawTx: rawTx,
						privateKey: this.privateKey,
						walletAddress: '0x' + this.getPublicKeyHex()
					})
						.then(res => {
							defer.resolve(res);
						})
						.catch(err => {
							defer.reject(err);
						});
				});
			})
			.catch(error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	async getPreviousTransactionCount() {
		return SqlLiteService.getWalletSettingsByWalletId(this.id).then(settings => {
			return settings[0].previousTransactionCount;
		});
	}

	async updatePreviousTransactionCount() {
		if (typeof $rootScope.previousTransactionCount != 'number') {
			return;
		}

		let settings = await SqlLiteService.getWalletSettingsByWalletId(this.id);
		let setting = settings[0];
		setting.previousTransactionCount = $rootScope.previousTransactionCount;
		await SqlLiteService.saveWalletSettings(setting);
	}
}

module.exports = Wallet;
