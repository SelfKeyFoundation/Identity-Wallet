'use strict';

import Token from '../classes/token.js';
import EthUtils from '../classes/eth-utils.js';

const tokensArray = require('../store/tokens/eth-tokens.json');

function TokenService($rootScope, $log, $http, EtherScanService) {
  'ngInject';

  $log.info('TokenService Initialized');

  const TOKEN_MAP = {};

  class TokenService {

    constructor() { }

    init(userAddress) {
      for (let i in tokensArray) {
        let t = tokensArray[i];
        Token.addContractToMap(t.symbol, t);
        let token = new Token(t.address, userAddress, t.symbol, t.decimal, t.type);
        Object.defineProperty(TOKEN_MAP, t.symbol, {
          enumerable: true,
          value: token
        });
      }
    }

    loadBalanceBySymbol(symbol) {
      let token = TOKEN_MAP[symbol];
      let data = token.generateBalanceData();
      token.promise = EtherScanService.getEthCall(data);
      token.promise.then((balanceHex) => {
        token.balance = balanceHex;
        token.balanceDecimal = EthUtils.hexToDecimal(balanceHex);
      });
    }

    loadAllbalance() {
      for (let key in TOKEN_MAP) {
        if (TOKEN_MAP.hasOwnProperty(key)) {
          let t = TOKEN_MAP[key];
          this.loadBalanceBySymbol(t.symbol)
        }
      }
    }

    getBySymbol(symbol) {
      return TOKEN_MAP[symbol];
    }
  };

  return new TokenService();
}

export default TokenService;