'use strict';

import Token from '../classes/token.js';
import EthUtils from '../classes/eth-utils.js';

const TOKENS_CONTRACT_ARRAY = require('../store/tokens/eth-tokens.json');

function TokenService($rootScope, $log, $http, $interval, $q, EVENTS, EtherScanService, Web3Service) {
  'ngInject';

  $log.info('TokenService Initialized');

  let TOKENS_MAP = {};

  let totalInitialized = 0;
  let loadBalanceQueue = [];

  class TokenService {

    constructor() {
      this.isInitialized = false;
      Token.Web3Service = Web3Service;
      Token.$q = $q;
    }

    addTokenToMap(key, token) {
      Object.defineProperty(TOKENS_MAP, token.symbol, {
        enumerable: true,
        value: token
      });
      
      //TOKENS_MAP[token.symbol] = token;
      $rootScope.$broadcast(EVENTS.NEW_TOKEN_ADDED, token);
      return TOKENS_MAP;
    }

    init() {
      if(!this.isInitialized){
        for (let i in TOKENS_CONTRACT_ARRAY) {
          let t = TOKENS_CONTRACT_ARRAY[i];
          let token = new Token(t.address, t.symbol, Number(t.decimal), t.type);
          this.addTokenToMap(t.symbol, token);
        }
        this.isInitialized = true;
      }
    }

    loadBalanceBySymbol(userAddress, symbol) {
      let token = TOKENS_MAP[symbol];
      let data = token.generateBalanceData(userAddress);
      //loadBalanceQueue.push({token: token, data: data});
      
      /*
      token.promise = EtherScanService.getEthCall(data);
      token.promise.then((balanceHex) => {
        token.balance = balanceHex;
        token.balanceDecimal = EthUtils.hexToDecimal(balanceHex);
      });
      */
    }

    getBalanceBySymbol(userAddress, symbol) {
      let defer = $q.defer();

      let token = TOKENS_MAP[symbol];
      let data = token.generateBalanceData(userAddress);
      
      token.promise = EtherScanService.getEthCall(data);
      token.promise.then((balanceHex) => {
        token.balance = balanceHex;
        token.balanceDecimal = EthUtils.hexToDecimal(balanceHex);
        defer.resolve(token);
      });

      return defer.promise;
    }

    loadAllbalance(userAddress) {
      for (let key in TOKENS_MAP) {
        if (TOKENS_MAP.hasOwnProperty(key)) {
          let t = TOKENS_MAP[key];
          this.loadBalanceBySymbol(userAddress, t.symbol)
        }
      }
    }

    getBySymbol(symbol) {
      return TOKENS_MAP[symbol];
    }

    getAll() {
      return TOKENS_MAP;
    }
  };

  return new TokenService();
}

export default TokenService;