'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function SqlLiteService($rootScope, $log, $q, $interval, $timeout, RPCService, EVENTS) {
    'ngInject';

    $log.debug('SqlLiteService Initialized');

    let ID_ATTRIBUTE_TYPES_STORE = {};
    let TOKENS_STORE = {};
    let TOKEN_PRICES_STORE = {};
    let WALLETS_STORE = {};
    let GUIDE_SETTINGS = {};
    let COUNTRIES = [];

    // APP_SETTINGS = {}
    // WALLET_SETTINGS = {}

    let tokenPriceUpdaterInterval = null;

    class SqlLiteService {

        constructor() {
            if (RPCService.ipcRenderer) {
                this.loadData().then((resp) => {
                    $log.info("DONE", ID_ATTRIBUTE_TYPES_STORE, TOKENS_STORE, TOKEN_PRICES_STORE, WALLETS_STORE);
                    this.startTokenPriceUpdaterListener();
                }).catch((error) => {
                    $log.error(error);
                });
            } else {
                defer.reject({ message: 'electron RPC not available' });
            }

            $rootScope.$on("$destroy", () => {
                this.stopTokenPriceUpdaterListener();
            });
        }

        /**
         * Load
         */
        loadData() {
            let promises = [];

            promises.push(this.loadGuideSettings());
            promises.push(this.loadIdAttributeTypes());
            promises.push(this.loadTokens());
            promises.push(this.loadTokenPrices());
            promises.push(this.loadWallets());
            promises.push(this.loadCountries());

            return $q.all(promises).then((data) => {
                $rootScope.$broadcast(EVENTS.APP_DATA_LOAD);
            });
        }

        /**
         *
         */
        loadTokens() {
            return RPCService.makeCall('getTokens', null).then((tokens) => {
                if (tokens) {
                    for (let i in tokens) {
                        let item = tokens[i];
                        TOKENS_STORE[item.symbol] = item;
                    }
                }
            });
        }

        loadIdAttributeTypes() {
            return RPCService.makeCall('getIdAttributeTypes', null).then((idAttributeTypes) => {
                if (idAttributeTypes) {
                    for (let i in idAttributeTypes) {
                        let item = idAttributeTypes[i];
                        item.entity = JSON.parse(item.entity);
                        ID_ATTRIBUTE_TYPES_STORE[item.key] = item;
                    }
                }
            });
        }

        loadTokenPrices() {
            return RPCService.makeCall('getTokenPrices', null).then((tokenPrices) => {
                if (tokenPrices) {
                    for (let i in tokenPrices) {
                        let item = tokenPrices[i];
                        TOKEN_PRICES_STORE[item.id] = item;
                    }
                    $log.info("TOKEN_PRICES", "LOADED", TOKEN_PRICES_STORE);
                }
            });
        }

        loadWallets() {
            return RPCService.makeCall('getWallets', null).then((wallets) => {
                if (wallets) {
                    for (let i in wallets) {
                        let item = wallets[i];
                        WALLETS_STORE[item.publicKey] = item;
                    }
                }
            });
        }

        loadGuideSettings() {
            return RPCService.makeCall('getGuideSettings', null).then((guideSettings) => {
                if (guideSettings && guideSettings.length) {
                    GUIDE_SETTINGS = guideSettings[0];
                }
            });
        }

        loadCountries() {
            return RPCService.makeCall('getCountries', null).then((data) => {
                if (data && data.length) {
                    COUNTRIES = data;
                }
            });
        }

        /**
         *
         */
        startTokenPriceUpdaterListener() {
            tokenPriceUpdaterInterval = $interval(() => {
                this.loadTokenPrices();
            }, 35000)
        }

        stopTokenPriceUpdaterListener() {
            $interval.cancel(tokenPriceUpdaterInterval);
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
         * id_attributes
         */
        loadIdAttributes(walletId) {
            return RPCService.makeCall('getIdAttributes', { walletId: walletId });
        }

        addIdAttribute(idAttribute) {
            return RPCService.makeCall('addIdAttribute', idAttribute);
        }

        deleteIdAttribute(idAttribute){
            return RPCService.makeCall('deleteIdAttribute', idAttribute);
        }

        /**
         *
         */
        registerActionLog(actionText, title){
            let theAction = {
                walletId: $rootScope.wallet.id,
                title: title || "untitled",
                content: actionText
            }
            return RPCService.makeCall('actionLogs_add', theAction);
        }

        loadWalletHistory(walletId){
            return RPCService.makeCall('actionLogs_findAll', {walletId: walletId});
        }

        /**
         *
         */
        updateIdAttributeItemValueStaticData (idAttributeValue) {
            return RPCService.makeCall('updateIdAttributeItemValueStaticData', idAttributeValue);
        }

        updateIdAttributeItemValueDocument (idAttributeItemValue, document) {
            return RPCService.makeCall('updateIdAttributeItemValueDocument', { idAttributeItemValue: idAttributeItemValue, document: document});
        }

        /**
         *
         */
        loadDocumentById (documentId) {
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

        insertTransactionHistory(data) {
            return RPCService.makeCall('insertTransactionHistory', data);
        }

        getTransactionsHistoryByWalletId(walletId) {
            return RPCService.makeCall('getTransactionsHistoryByWalletId', walletId);
        }

        getTransactionsHistoryByWalletIdAndTokenId(query) {
            return RPCService.makeCall('getTransactionsHistoryByWalletIdAndTokenId', query);
        }

        saveWalletSettings(data) {
            return RPCService.makeCall('saveWalletSettings', data);
        }

        insertWalletToken(data) {
            return RPCService.makeCall('insertWalletToken', data);
        }

        insertNewWalletToken(data, balance, walletId) {
            return RPCService.makeCall('insertNewWalletToken', {data: data, balance: balance, walletId: walletId});
        }

        updateWalletToken(data) {
            return RPCService.makeCall('updateWalletToken', data);
        }

    }

    return new SqlLiteService();
}

module.exports = SqlLiteService;
