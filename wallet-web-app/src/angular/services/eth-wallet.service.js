'use strict';

function EthWalletService($rootScope, $window, $q, $timeout, $log, $http) {
  'ngInject';

  $log.info('EthWalletService Initialized');

  /**
   * 
   */
  class EthWalletService {

    constructor (priv, pub, path, hwType, hwTransport) {
      if (typeof priv != "undefined") {
        this.privKey = priv.length == 32 ? priv : Buffer(priv, 'hex')
      }
  
      this.pubKey = pub;
      this.path = path;
      this.hwType = hwType;
      this.hwTransport = hwTransport;
      this.type = "default";
    }

    generate (icapDirect) {
      if (icapDirect) {
        while (true) {
          let privKey = ethUtil.crypto.randomBytes(32)
          if (ethUtil.privateToAddress(privKey)[0] === 0) {
            return new EthWalletService(privKey)
          }
        }
      } else {
        return new EthWalletService(ethUtil.crypto.randomBytes(32))
      }
    }

    setTokens (address) {
      this.tokenObjs = [];
      var defaultTokensAndNetworkType = globalFuncs.getDefaultTokensAndNetworkType();
      var tokens = Token.popTokens;
  
      for (var i = 0; i < tokens.length; i++) {
        this.tokenObjs.push(
          new Token(
            tokens[i].address,
            this.getAddressString(),
            tokens[i].symbol,
            tokens[i].decimal,
            tokens[i].type
          )
        );
        this.tokenObjs[this.tokenObjs.length - 1].setBalance();
      }
    }
  };
}
  export default EthWalletService;