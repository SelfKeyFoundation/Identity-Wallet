'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const IdAttributeType = requireAppModule('angular/classes/id-attribute-type');
const IdAttribute = requireAppModule('angular/classes/id-attribute');
const Ico = requireAppModule('angular/classes/ico');

function SqlLiteService($rootScope, $log, $q, $timeout, CONFIG, ElectronService, CommonService, RPCService, EVENTS) {
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

    class SqlLiteService {

        constructor() {
            if (RPCService.ipcRenderer) {
                Wallet.SqlLiteService = this;

                this.loadData().then((resp) => {
                    $log.info("DONE", ID_ATTRIBUTE_TYPES_STORE, TOKENS_STORE, TOKEN_PRICES_STORE, WALLETS_STORE);
                }).catch((error) => {
                    $log.error(error);
                });
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
            promises.push(this.loadTokenPrices());
            promises.push(this.loadWallets());
            promises.push(this.loadCountries());

            return $q.all(promises).then((data) => {
                $rootScope.$broadcast(EVENTS.APP_DATA_LOAD);
            });
        }

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
         * wallets
         */
        getWalletPublicKeys () {
            return Object.keys(WALLETS_STORE);
        }

        getWallets () {
            return WALLETS_STORE;
        }

        saveWallet (data) {
            return RPCService.makeCall('saveWallet', data);
        }

        /**
         * guide_settings
         */
        getGuideSettings () {
            return GUIDE_SETTINGS;
        }

        saveGuideSettings (data) {
            return RPCService.makeCall('saveGuideSettings', data);
        }

        /**
         * countries
         */
        getCountries () {
            return COUNTRIES;
        }

        /**
         * id_attribute_types
         */
        getIdAttributeTypes () {
            return ID_ATTRIBUTE_TYPES_STORE;
        }

        /**
         * id_attributes
         */
        loadIdAttributes (walletId) {
            return RPCService.makeCall('getIdAttributes', {walletId: walletId});
        }

    }

    return new SqlLiteService();
}

module.exports = SqlLiteService;
