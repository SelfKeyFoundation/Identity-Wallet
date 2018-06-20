'use strict';

const Token = require('../classes/token');

function EtherScanService($rootScope, $window, $q, $timeout, $log, $http, $httpParamSerializerJQLike, EVENTS, CONFIG) {
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
    const REQUEST_INTERVAL_DELAY = 200;

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

            EtherScanService.q = window.async.queue((data, callback) => {
                $log.info("EtherScan REQUESTS IN QUEUE: ", EtherScanService.q.length(), "######");

                let promise = $http.get(data.url);

                $timeout(() => {
                    callback(promise);
                }, REQUEST_INTERVAL_DELAY);
            }, 1);
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

        static waitForTicket(defer, url, args) {
            EtherScanService.q.push({ url: url }, (promise) => {
                EtherScanService.handlePromise(defer, promise);
            });
        }

    };

    return new EtherScanService();
}
EtherScanService.$inject = ["$rootScope", "$window", "$q", "$timeout", "$log", "$http", "$httpParamSerializerJQLike", "EVENTS", "CONFIG"];
module.exports = EtherScanService;
