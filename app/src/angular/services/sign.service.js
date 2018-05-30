'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const Token = requireAppModule('angular/classes/token');


function SignService($rootScope, $window, $q, $timeout, $log, CONFIG, LedgerService) {
  'ngInject';

  $log.debug('SignService Initialized');

  let SignService = function () {
    Wallet.SignService = this;
    Token.SignService = this;

    this.signTranactionByPrivateKey = function (rawTx, privateKey) {
      return new Promise((resolve) => {
        let eTx = new Tx(rawTx);
        eTx.sign(privateKey);
        resolve('0x' + eTx.serialize().toString('hex'));
      });
    };

    this.signTransactionByLedger = function (dataToSign, address, derivationPath) {
      return LedgerService.signTransaction(dataToSign, address, derivationPath);
    }

    this.signTransaction = function (args) {
      let { rawTx, profile, privateKey, walletAddress } = args;
      if (profile == 'ledger') {
        debugger;
        let derivationPath = $rootScope.selectedLedgerAccount.derivationPath;
        return this.signTransactionByLedger(rawTx, walletAddress, derivationPath);
      }

      if (profile == 'local') {
        return this.signTranactionByPrivateKey(rawTx, privateKey);
      }
    }

  }

  return new SignService();
}

module.exports = SignService;