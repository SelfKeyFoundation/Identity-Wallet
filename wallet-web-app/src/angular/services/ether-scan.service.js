'use strict';

import Token from '../classes/token';

function EtherScanService($rootScope, $window, $q, $timeout, $log, $http, $httpParamSerializerJQLike, EVENTS, ElectronService) {
  'ngInject';

  $log.info('EtherScanService Initialized');

  // etehrscan
  const DEFAULT_SERVER = "etehrscan";
  // ropsten testnet
  const DEFAULT_CHAIN_ID = 3;

  // TODO move this into constants & configs
  const SERVER_CONFIG = {
    etehrscan: {
      1: { url: "https://api.etherscan.io/api", key: "4C1HD9C8VKIAEPWFK9DIS6ZUAQTBE7PMUD" },    // chainId : { "api url", key )
      3: { url: "https://ropsten.etherscan.io/api", key: "4C1HD9C8VKIAEPWFK9DIS6ZUAQTBE7PMUD" } // chainId : { "api url", key )
    }
  }

  let CHAIN_ID = null;
  let SERVER_URL = null;
  let API_KEY = null;

  setChainId(DEFAULT_CHAIN_ID);

  const REQUEST_CONFIG = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const ERROR_CODES = {
    "-32602": "invalid_hex",
    "-32010": "transaction_already_imported"
  }

  // TEMP
  const KEY_TOKEN_DATA = {
    "address": "0x5bc2d3b62f3546e1ac3b34ef0d956d5df7fc64be",
    "symbol": "KEY",
    "decimal": 18,
    "type": "default"
  };

  function setChainId(newChainId) {
    CHAIN_ID = newChainId;
    SERVER_URL = SERVER_CONFIG[DEFAULT_SERVER][newChainId].url;
    API_KEY = SERVER_CONFIG[DEFAULT_SERVER][newChainId].key;
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
      promise.then((response) => {
        if (response.data.error || !response.data || !response.data.result) {
          defer.reject({ "message": $rootScope.getTranslation(ERROR_CODES[response.data.error.code]), "error": response.data.error });
        } else {
          defer.resolve(response.data.result)
        }
      }).catch((error) => {
        defer.reject({ "message": $rootScope.getTranslation('http_connection_error') })
      });

      return defer.promise;
    }

    sendRawTransaction(trxSignedHex) {
      let defer = $q.defer();
      const apiUrl = SERVER_URL + "?module=proxy&action=eth_sendRawTransaction&tag=latest&apikey=" + API_KEY
      let primise = $http.post(apiUrl, $httpParamSerializerJQLike({ hex: trxSignedHex }), REQUEST_CONFIG);

      primise.then((response) => {
        if (response.data.error || !response.data || !response.data.result) {
          defer.reject({ "message": $rootScope.getTranslation(ERROR_CODES[response.data.error.code]), "error": response.data.error });
        } else {
          defer.resolve(response.data.result)
        }
      }).catch((error) => {
        defer.reject({ "message": $rootScope.getTranslation('http_connection_error') })
      });

      return defer.promise;
    }

    getTransaction(txHash) {
      let defer = $q.defer();
      const apiUrl = SERVER_URL + "?module=proxy&action=eth_getTransactionByHash&txHash=" + txHash + "&tag=latest&apikey=" + API_KEY

      $http.get(apiUrl).then((response) => {
        if (response.data.error || !response.data || !response.data.result) {
          defer.reject({ "message": $rootScope.getTranslation(ERROR_CODES[response.data.error.code]), "error": response.data.error });
        } else {
          defer.resolve(response.data.result)
        }
      }).catch((error) => {
        defer.reject({ "message": $rootScope.getTranslation('http_connection_error') })
      });
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

    // TODO - remove
    generateRawTransaction(nonce, gasPrice, gasLimit, to, value, data, privateKey, chainId, sendMode) {
      if (sendMode && sendMode.type == 'token') {
        to = KEY_TOKEN_DATA.address;
        data = Token.generateContractData(KEY_TOKEN_DATA.address, value, KEY_TOKEN_DATA.decimal);
      }
      
      return ElectronService.generateRawTransaction(
        nonce,
        gasPrice,
        gasLimit,
        to,
        value,
        data,
        privateKey,
        chainId
      );
    }
  };

  return new EtherScanService();
}

export default EtherScanService;