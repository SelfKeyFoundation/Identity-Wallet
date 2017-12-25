'use strict';

import Token from '../classes/token';
import EthUtils from '../classes/eth-utils';
import EthUnits from '../classes/eth-units';

import Web3 from 'web3';
//const Web3 = require('web3') ;

function dec2hexString(dec) {
  return '0x' + (dec + 0x10000).toString(16).substr(-4).toUpperCase();
}

// documentation
// https://www.myetherapi.com/
function Web3Service($rootScope, $window, $q, $timeout, $log, $http, $httpParamSerializerJQLike, EVENTS, ElectronService, CommonService, $interval) {
  'ngInject';

  $log.info('Web3Service Initialized');

  /**
   * 
   */
  const REQUEST_INTERVAL_DELAY = 1000;

  /**
   * 
   */
  const DEFAULT_NODE = "infura";

  /**
   * 1: main net
   * 2: test net
   */
  const DEFAULT_CHAIN_ID = 3;

  /**
   * 
   */
  const SERVER_CONFIG = {
    mew: {
      1: { url: "https://api.myetherapi.com/eth" },
      3: { url: "https://api.myetherapi.com/rop" }
    },
    infura: {
      1: { url: "https://mainnet.infura.io" },
      3: { url: "https://ropsten.infura.io" }
    }
  }

  let SELECTED_CHAIN_ID = null;
  let SELECTED_SERVER_URL = null;

  setChainId(DEFAULT_NODE, DEFAULT_CHAIN_ID);

  function setChainId(node, chainId) {
    SELECTED_CHAIN_ID = chainId;
    SELECTED_SERVER_URL = SERVER_CONFIG[node][chainId].url;
  }

  let lastRequestTime = 0;
  const requestQueue = [];

  /**
   * 
   */
  class Web3Service {

    constructor() {
      Web3Service.web3 = new Web3();
      Web3Service.web3.setProvider(new Web3Service.web3.providers.HttpProvider(SELECTED_SERVER_URL));

      $rootScope.$on(EVENTS.CHAIN_ID_CHANGED, (event, newChainId) => {
        setChainId(DEFAULT_NODE, newChainId);
      });

      console.log(Web3Service.web3.eth);
    }

    getBalance(addressHex) {
      let defer = $q.defer();

      // wei
      Web3Service.waitForTicket(defer, 'getBalance', [addressHex]);

      return defer.promise;
    }

    getTokenBalanceByData(userAddress, data) {
      let defer = $q.defer();

      // wei
      Web3Service.waitForTicket(defer, 'call', [{ to: userAddress, data: data }]);

      return defer.promise;
    }

    getEstimateGas(fromAddressHex, toAddressHex, amountHex) {
      let defer = $q.defer();

      //let amountHex = dec2hexString(amount); //"0x429d069189e0000";

      let args = {
        "from": fromAddressHex,
        "to": toAddressHex,
        "value": "0x429d069189e0000"
      }

      // wei
      Web3Service.waitForTicket(defer, 'estimateGas', [args]);

      return defer.promise;
    }

    getGasPrice() {
      let defer = $q.defer();

      // wei
      Web3Service.waitForTicket(defer, 'getGasPrice', []);

      return defer.promise;
    }

    getTransactionCount(addressHex) {
      let defer = $q.defer();

      // number
      Web3Service.waitForTicket(defer, 'getTransactionCount', [addressHex, 'pending']);

      return defer.promise;
    }

    sendRawTransaction(signedTxHex) {
      let defer = $q.defer();

      Web3Service.waitForTicket(defer, 'sendSignedTransaction', [signedTxHex]);

      return defer.promise;
    }

    getTransaction(transactionHex) {
      let defer = $q.defer();

      Web3Service.waitForTicket(defer, 'getTransaction', [transactionHex]);

      return defer.promise;
    }

    getTransactionReceipt(transactionHex) {
      let defer = $q.defer();

      Web3Service.waitForTicket(defer, 'getTransactionReceipt', [transactionHex]);

      return defer.promise;
    }

    static handlePromise(defer, promise) {
      promise.then((response) => {
        $log.info("response", response);
        defer.resolve(response)
      }).catch((error) => {
        $log.error("error", error);
        defer.reject($rootScope.buildErrorObject("ERR_HTTP_CONNECTION", error));
      });
    }

    static waitForTicket(defer, method, args) {
      let ticketId = CommonService.generateId();

      requestQueue.push({ ticketId: ticketId, time: new Date().getTime() + REQUEST_INTERVAL_DELAY * requestQueue.length });

      let interval = $interval(() => {

        for (let i in requestQueue) {
          if (requestQueue[i].ticketId === ticketId && requestQueue[i].time <= new Date().getTime()) {

            try {
              let promise = Web3Service.web3.eth[method].apply(this, args);
              Web3Service.handlePromise(defer, promise);

              $log.info("Request:", method, args, "sent at", new Date().getTime());
            } catch (e) {
              $log.error(e);
            } finally {
              requestQueue.splice(0, 1);
              $interval.cancel(interval);
            }

            break;
          }
        }

      }, 200);
    }

  };

  return new Web3Service();
}

export default Web3Service;