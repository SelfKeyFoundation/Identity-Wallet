'use strict';

import Wallet from '../classes/wallet.js';
import EthUnits from '../classes/eth-units.js';

function WalletService($rootScope, $log, $q, EVENTS, ElectronService, EtherScanService, TokenService) {
  'ngInject';

  $log.info('WalletService Initialized');

  let wallet = null;
  let selectedChainId = 3;

  /**
   * 
   */
  class WalletService {

    constructor() {
      $rootScope.$on(EVENTS.NEW_TOKEN_ADDED, (event, token) => {
        this.loadTokenBalance(token.symbol);
      });

      $rootScope.$on(EVENTS.CHAIN_ID_CHANGED, (event, newChainId) => {
        selectedChainId = newChainId;
      });
    }

    importUsingKeystoreFileDialog() {
      let defer = $q.defer();

      let promise = ElectronService.openFileSelectDialog();

      promise.then((filePath) => {
        this.importUsingKeystoreFilePath(filePath).then((wallet) => {
          defer.resolve(wallet);
        }).catch((error) => {
          defer.reject(error);
        });
      });

      return defer.promise;
    }

    importUsingKeystoreFilePath(filePath) {
      let defer = $q.defer();

      let promise = ElectronService.importEtherKeystoreFile(filePath);
      promise.then((keystoreObject) => {
        wallet = new Wallet(keystoreObject);

        // Broadcast about changes
        $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_LOADED, wallet);

        TokenService.init(wallet.getAddress());

        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject(error);
      });

      return defer.promise;
    }

    unlockKeystoreObject(password) {
      let defer = $q.defer();

      let promise = ElectronService.unlockEtherKeystoreObject(wallet.keystoreObject, password);
      promise.then((privateKey) => {
        wallet.setPrivateKey(privateKey);

        // Broadcast about changes
        $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_UNLOCKED, wallet);

        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject(error);
      });

      return defer.promise;
    }

    loadBalance() {
      let defer = $q.defer();

      // TODO check wallet address

      let promise = EtherScanService.getBalance(wallet.getAddress());
      promise.then((balanceWei) => {
        console.log(balanceWei);

        wallet.balanceWei = balanceWei
        wallet.balanceEth = EthUnits.toEther(balanceWei, 'wei');

        defer.resolve(wallet);
      }).catch((error) => {
        console.log(error);
        defer.reject(error);
      });

      return defer.promise;
    }

    loadTokenBalance(symbol) {
      // TODO check Address
      if (symbol) {
        TokenService.loadBalanceBySymbol(symbol);
      } else {
        TokenService.loadAllbalance();
      }
    }

    // TODO - must include pending transactions... 
    loadTransactionCount() {
      let defer = $q.defer();
      // TODO check wallet address
      let promise = EtherScanService.getTransactionCount(wallet.getAddress());
      promise.then((data) => {
        wallet.nonceHex = data.hex;
        wallet.nonceDec = data.dec;
        defer.resolve(wallet);
      }).catch((error) => {
        console.log(error);
        defer.reject(error);
      });
      return defer.promise;
    }

    loadGasPrice() {
      let defer = $q.defer();
      // TODO check wallet address
      let promise = EtherScanService.getGasPrice();
      promise.then((data) => {
        console.log("GAS PRICE", data);
        defer.resolve(wallet);
      }).catch((error) => {
        console.log(error);
        defer.reject(error);
      });
      return defer.promise;
    }

    /**
     * 
     * @param {hex} toAddress 
     * @param {eth} value 
     * @param {wei} gasPrice 
     * @param {wei} gasLimit 
     * @param {hex} data Contract data
     */
    generateEthRawTransaction(toAddress, value, gasPrice, gasLimit, data) {
      // TODO check nonce.. 
      return ElectronService.generateRawTransaction(
        EthUtils.sanitizeHex(wallet.nonceHex),
        EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPrice)),
        EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimit)),
        toAddress,
        EthUtils.sanitizeHex(EthUtils.decimalToHex(EthUnits.toWei(value))),
        data,
        wallet.privateKey,
        selectedChainId
      );
    }

    generateTokenRawTransaction(toAddress, value, gasPrice, gasLimit, data) {
      // TODO check nonce.. 
      // TODO
    }

  };

  return new WalletService();
}

export default WalletService;