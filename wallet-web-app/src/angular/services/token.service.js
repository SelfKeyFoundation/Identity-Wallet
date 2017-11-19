'use strict';

import Token from '../classes/token.js';
import EthUtils from '../classes/eth-utils.js';

const TOKENS_CONTRACT_ARRAY = require('../store/tokens/eth-tokens.json');

function TokenService($rootScope, $log, $http, $interval, EVENTS, EtherScanService) {
  'ngInject';

  $log.info('TokenService Initialized');

  const TOKENS_MAP = {};

  let totalInitialized = 0;
  let loadBalanceQueue = [];

  class TokenService {

    constructor() {
      $interval(()=>{
        if(loadBalanceQueue.length > 0){
          let token = loadBalanceQueue[0].token;
          token.promise = EtherScanService.getEthCall(loadBalanceQueue[0].data);
          token.promise.then((balanceHex)=>{
            token.balance = balanceHex;
            token.balanceDecimal = EthUtils.hexToDecimal(balanceHex);
          });
          loadBalanceQueue.splice(0, 1);
        }
      }, 10);
    }

    addTokenToMap(key, token) {
      Object.defineProperty(TOKENS_MAP, token.symbol, {
        enumerable: true,
        value: token
      });
      $rootScope.$broadcast(EVENTS.NEW_TOKEN_ADDED, token);
      return TOKENS_MAP;
    }

    init(userAddress) {
      for (let i in TOKENS_CONTRACT_ARRAY) {
        let t = TOKENS_CONTRACT_ARRAY[i];
        let token = new Token(t.address, userAddress, t.symbol, Number(t.decimal), t.type);
        this.addTokenToMap(t.symbol, token);
      }
    }

    loadBalanceBySymbol(symbol) {
      let token = TOKENS_MAP[symbol];
      let data = token.generateBalanceData();
      //loadBalanceQueue.push({token: token, data: data});
      
      /*
      token.promise = EtherScanService.getEthCall(data);
      token.promise.then((balanceHex) => {
        token.balance = balanceHex;
        token.balanceDecimal = EthUtils.hexToDecimal(balanceHex);
      });
      */
    }

    loadAllbalance() {
      for (let key in TOKENS_MAP) {
        if (TOKENS_MAP.hasOwnProperty(key)) {
          let t = TOKENS_MAP[key];
          this.loadBalanceBySymbol(t.symbol)
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