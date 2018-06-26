'use strict';

const Wallet = require('../classes/wallet');

function SqlLiteService($rootScope, $log, $q, $interval, $timeout, RPCService, EVENTS) {
	'ngInject';

	$log.debug('SqlLiteService Initialized');

	let ID_ATTRIBUTE_TYPES_STORE = {};
	let TOKENS_STORE = {};
	let TOKEN_PRICES_STORE = {};
	let WALLETS_STORE = {};
	let GUIDE_SETTINGS = {};
	let COUNTRIES = [];
	let EXCHANGE_DATA = [];

	// APP_SETTINGS = {}
	// WALLET_SETTINGS = {}

	class SqlLiteService {
		constructor() {
			if (RPCService.ipcRenderer) {
				this.loadData()
					.then(resp => {
						$log.info(
							'DONE',
							ID_ATTRIBUTE_TYPES_STORE,
							TOKENS_STORE,
							TOKEN_PRICES_STORE,
							WALLETS_STORE
						);
					})
					.catch(error => {
						$log.error(error);
					});
				this.listenForDataChange();
			} else {
				defer.reject({ message: 'electron RPC not available' });
			}
		}

		/**
		 * Load
		 */
		loadData() {
			let promises = [];

			promises.push(this.loadGuideSettings());
			promises.push(this.loadIdAttributeTypes());
			promises.push(this.loadTokens());
			promises.push(this.loadWallets());
			promises.push(this.loadCountries());
			promises.push(this.loadExchangeData());

			return $q.all(promises).then(data => {
				$rootScope.$broadcast(EVENTS.APP_DATA_LOAD);
			});
		}
		/**
		 * Will listen for RPC data change event
		 */
		listenForDataChange() {
			return RPCService.on('ON_DATA_CHANGE', (event, dataType, data) => {
				switch (dataType) {
					case 'TOKEN_PRICE':
						this.loadTokenPrices(data);
						break;
					default:
						break;
				}
			});
		}

		/**
		 *
		 */
		loadTokens() {
			return RPCService.makeCall('getTokens', null).then(tokens => {
				if (tokens) {
					for (let i in tokens) {
						let item = tokens[i];
						TOKENS_STORE[item.symbol] = item;
					}
				}
			});
		}

		loadIdAttributeTypes() {
			return RPCService.makeCall('getIdAttributeTypes', null).then(idAttributeTypes => {
				if (idAttributeTypes) {
					for (let i in idAttributeTypes) {
						let item = idAttributeTypes[i];
						item.entity = JSON.parse(item.entity);
						ID_ATTRIBUTE_TYPES_STORE[item.key] = item;
					}
				}
			});
		}

		loadTokenPrices(data) {
			if (data) {
				for (let i in data) {
					let item = data[i];
					TOKEN_PRICES_STORE[item.id] = item;
				}
				$log.info('TOKEN_PRICES', 'LOADED', TOKEN_PRICES_STORE);
			}
		}

		loadWallets() {
			return RPCService.makeCall('findAllWallets', null).then(wallets => {
				if (wallets) {
					for (let i in wallets) {
						let item = wallets[i];
						WALLETS_STORE[item.publicKey] = item;
					}
				}
			});
		}

		loadGuideSettings() {
			return RPCService.makeCall('getGuideSettings', null).then(guideSettings => {
				if (guideSettings && guideSettings.length) {
					GUIDE_SETTINGS = guideSettings[0];
				}
			});
		}

		loadCountries() {
			return RPCService.makeCall('getCountries', null).then(data => {
				if (data && data.length) {
					COUNTRIES = data;
				}
			});
		}

		/**
		 * Load Exchange Data
		 */
		loadExchangeData() {
			return RPCService.makeCall('findAllExchangeData', null).then(data => {
				if (data && data.length) {
					EXCHANGE_DATA = data;
					$log.info('EXCHANGE_DATA', 'LOADED', EXCHANGE_DATA);
				}
			});
		}

		/**
		 * wallets
		 */
		getWalletPublicKeys() {
			return Object.keys(WALLETS_STORE);
		}

		getWallets() {
			return WALLETS_STORE;
		}

		getTokens() {
			return TOKENS_STORE;
		}

		saveWallet(data) {
			return RPCService.makeCall('saveWallet', data);
		}

		/**
		 * wallet_tokens
		 */
		loadWalletTokens(walletId) {
			return RPCService.makeCall('getWalletTokens', { walletId: walletId });
		}

		/**
		 * guide_settings
		 */
		getGuideSettings() {
			return GUIDE_SETTINGS;
		}

		saveGuideSettings(data) {
			return RPCService.makeCall('saveGuideSettings', data);
		}

		/**
		 * countries
		 */
		getCountries() {
			return COUNTRIES;
		}

		/**
		 * id_attribute_types
		 */
		getIdAttributeTypes() {
			return ID_ATTRIBUTE_TYPES_STORE;
		}

		/**
		 * get exchange data
		 */
		getExchangeData() {
			return EXCHANGE_DATA;
		}

		/**
		 * id_attributes
		 */
		loadIdAttributes(walletId) {
			return RPCService.makeCall('getIdAttributes', { walletId: walletId });
		}

		/**
		 *
		 */
		registerActionLog(actionText, title) {
			let theAction = {
				walletId: $rootScope.wallet.id,
				title: title || 'untitled',
				content: actionText
			};
			return RPCService.makeCall('actionLogs_add', theAction);
		}

		loadWalletHistory(walletId) {
			return RPCService.makeCall('actionLogs_findAll', { walletId: walletId });
		}

		/**
		 *
		 */
		loadDocumentById(documentId) {
			return RPCService.makeCall('loadDocumentById', { documentId: documentId });
		}

		/**
		 * token_prices
		 */
		getTokenPrices() {
			return TOKEN_PRICES_STORE;
		}

		getTokenPriceBySymbol(symbol) {
			for (let i in TOKEN_PRICES_STORE) {
				if (TOKEN_PRICES_STORE[i].symbol.toUpperCase() === symbol.toUpperCase()) {
					return TOKEN_PRICES_STORE[i];
				}
			}
			return null;
		}
		/**
		 *
		 * wallet settings
		 */
		getWalletSettingsByWalletId(data) {
			return RPCService.makeCall('getWalletSettingsByWalletId', data);
		}

		saveWalletSettings(data) {
			return RPCService.makeCall('saveWalletSettings', data);
		}

		removeAirdropCode(walletSetting) {
			walletSetting.airDropCode = null;
			return RPCService.makeCall('saveWalletSettings', walletSetting);
		}

		insertWalletToken(data) {
			return RPCService.makeCall('insertWalletToken', data);
		}

		insertNewWalletToken(data, balance, walletId) {
			return RPCService.makeCall('insertNewWalletToken', {
				data: data,
				balance: balance,
				walletId: walletId
			});
		}

		updateWalletToken(data) {
			return RPCService.makeCall('updateWalletToken', data);
		}
	}

	return new SqlLiteService();
}
SqlLiteService.$inject = [
	'$rootScope',
	'$log',
	'$q',
	'$interval',
	'$timeout',
	'RPCService',
	'EVENTS'
];
module.exports = SqlLiteService;
