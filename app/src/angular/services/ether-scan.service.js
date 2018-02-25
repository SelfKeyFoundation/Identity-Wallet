'use strict';

const Token = requireAppModule('angular/classes/token');

function EtherScanService($rootScope, $window, $q, $timeout, $log, $http, $httpParamSerializerJQLike, EVENTS, ElectronService, CONFIG) {
    'ngInject';

    $log.info('EtherScanService Initialized');

    // etehrscan
    const DEFAULT_NODE = "etehrscan";

    // TODO move this into constants & configs
    const SERVER_CONFIG = {
        etehrscan: {
            1: { url: "https://api.etherscan.io/api", key: "4C1HD9C8VKIAEPWFK9DIS6ZUAQTBE7PMUD" },    // chainId : { "api url", key )
            3: { url: "https://ropsten.etherscan.io/api", key: "4C1HD9C8VKIAEPWFK9DIS6ZUAQTBE7PMUD" }     // chainId : { "api url", key )
        }
    }

    let CHAIN_ID = null;
    let SERVER_URL = null;
    let API_KEY = null;

    setChainId(CONFIG.chainId);

    const REQUEST_CONFIG = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    const ERROR_CODES = {
        "-32602": "ERR_INVALID_HEX",
        "-32010": "ERR_TX_ALREADY_IMPORTED"
    }

    function setChainId(newChainId) {
        CHAIN_ID = newChainId;
        SERVER_URL = SERVER_CONFIG[DEFAULT_NODE][newChainId].url;
        API_KEY = SERVER_CONFIG[DEFAULT_NODE][newChainId].key;
    }

    /**
     *
     */
    class EtherScanService {
        constructor() {
            $rootScope.$on(EVENTS.CHAIN_ID_CHANGED, (event, newChainId) => {
                setChainId(newChainId);
            });
        }

        getBalance(address) {
            let defer = $q.defer();

            const apiUrl = SERVER_URL + "?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + API_KEY
            let promise = $http.get(apiUrl);

            EtherScanService.handlePromise(defer, promise);

            return defer.promise;
        }

        sendRawTransaction(trxSignedHex) {
            let defer = $q.defer();
            const apiUrl = SERVER_URL + "?module=proxy&action=eth_sendRawTransaction&tag=latest&apikey=" + API_KEY
            let primise = $http.post(apiUrl, $httpParamSerializerJQLike({ hex: trxSignedHex }), REQUEST_CONFIG);

            EtherScanService.handlePromise(defer, promise);

            return defer.promise;
        }

        getTransaction(txHash) {
            let defer = $q.defer();
            const apiUrl = SERVER_URL + "?module=proxy&action=eth_getTransactionByHash&txHash=" + txHash + "&tag=latest&apikey=" + API_KEY

            let promise = $http.get(apiUrl);

            EtherScanService.handlePromise(defer, promise);

            return defer.promise;
        }

        getCurrentBlock() {
            const apiUrl = SERVER_URL + "?module=proxy&action=eth_blockNumber&tag=latest&apikey=" + API_KEY
            return $http.get(apiUrl);
        }

        // TODO - remove after we implement custom node method
        getTransactionCount(address) {
            let defer = $q.defer();
            const apiUrl = SERVER_URL + "?module=proxy&action=eth_getTransactionCount&address=" + address + "&tag=latest&apikey=" + API_KEY
            $http.get(apiUrl).then((response) => {
                if (response.data.error || !response.data || !response.data.result) {
                    defer.reject({ "message": $rootScope.getTranslation(ERROR_CODES[response.data.error.code]), "error": response.data.error });
                } else {
                    try {
                        defer.resolve({
                            hex: response.data.result,
                            dec: Number(response.data.result)
                        });
                    } catch (e) {
                        // TODO - orginise error messages
                        defer.reject({ "message": e })
                    }
                }
            }).catch((error) => {
                defer.reject({ "message": $rootScope.getTranslation('http_connection_error') })
            });

            return defer.promise;
        }

        getEthCall(data) {
            let defer = $q.defer();

            const apiUrl = SERVER_URL + "?module=proxy&action=eth_call&to=" + data.to + "&data=" + data.data + "&tag=latest&apikey=" + API_KEY

            $http.get(apiUrl).then((response) => {
                if (response.data.error || !response.data || !response.data.result) {
                    defer.reject({ "message": $rootScope.getTranslation(ERROR_CODES[response.data.error.code]), "error": response.data.error });
                } else {
                    try {
                        defer.resolve(response.data.result);
                    } catch (e) {
                        // TODO - orginise error messages
                        defer.reject({ "message": e })
                    }
                }
            }).catch((error) => {
                defer.reject({ "message": $rootScope.getTranslation('http_connection_error') })
            });

            return defer.promise;
        }

        getGasPrice() {
            let defer = $q.defer();

            const apiUrl = SERVER_URL + "?module=proxy&action=eth_gasPrice&apikey=" + API_KEY

            $http.get(apiUrl).then((response) => {
                if (response.data.error || !response.data || !response.data.result) {
                    defer.reject({ "message": $rootScope.getTranslation(ERROR_CODES[response.data.error.code]), "error": response.data.error });
                } else {
                    try {
                        defer.resolve({
                            hex: response.data.result,
                            dev: Number(response.data.result)
                        });
                    } catch (e) {
                        // TODO - orginise error messages
                        defer.reject({ "message": e })
                    }
                }
            }).catch((error) => {
                defer.reject({ "message": $rootScope.getTranslation('http_connection_error') })
            });

            return defer.promise;
        }

        static handlePromise(defer, promise) {
            promise.then((response) => {
                if (response.data.error || !response.data || !response.data.result) {
                    defer.reject($rootScope.buildErrorObject(ERROR_CODES[response.data.error.code], response.data.error));
                } else {
                    defer.resolve(response.data.result)
                }
            }).catch((error) => {
                defer.reject($rootScope.buildErrorObject("ERR_HTTP_CONNECTION", error));
            });
        }
    };

    return new EtherScanService();
}

module.exports = EtherScanService;
