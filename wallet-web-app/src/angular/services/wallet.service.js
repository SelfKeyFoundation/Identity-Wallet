'use strict';

import Wallet from '../classes/wallet.js';
import EthUnits from '../classes/eth-units.js';

function WalletService($log, $q, ElectronService, EtherScanService) {
  'ngInject';

  $log.info('WalletService Initialized');

  let wallet = null;

  /**
   * 
   */
  class WalletService {

    constructor() { }

    importUsingKeystoreFileDialog() {
      let defer = $q.defer();

      let promise = ElectronService.openFileSelectDialog();
      promise.then((filePath) => {
        let promise = ElectronService.importEtherKeystoreFile(filePath);
        promise.then((keystoreObject) => {
          wallet = new Wallet(keystoreObject);
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
      promise.then((balanceWei)=>{
        console.log(balanceWei);

        wallet.balanceWei = balanceWei
        wallet.balanceEth = EthUnits.toEther(balanceWei, 'wei');

        defer.resolve(wallet);
      }).catch((error)=>{
        console.log(error);
        defer.reject(error);
      });

      return defer.promise;
    }

  };

  return new WalletService();
}

export default WalletService;