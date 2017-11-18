'use strict';

import Wallet from '../classes/wallet.js';
import EthUtils from '../classes/eth-utils.js';
import EthUnits from '../classes/eth-units.js';
import Token from '../classes/token.js';

import Tx from 'ethereumjs-tx';

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
        TokenService.init(wallet.getAddress());

        // Broadcast about changes
        $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_LOADED, wallet);

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
      
      // TODO
      // switch ElectronService.generateRawTransaction with 
      // new Tx(rawTx).sign(new Buffer(wallet.privateKey, 'hex'));

      let rawTx = {
        nonce: EthUtils.sanitizeHex(wallet.nonceHex), 
        gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPrice)),
        gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimit)),
        to: EthUtils.sanitizeHex(toAddress),
        value: EthUtils.sanitizeHex(EthUtils.decimalToHex(EthUnits.toWei(value))),
        chainId: selectedChainId
      }

      if(data){
        rawTx.data = EthUtils.sanitizeHex(data);
      }

      console.log("generateEthRawTransaction before", rawTx);
      let eTx = new Tx(rawTx);
      
      //new Buffer(wallet.privateKey, 'hex')
      eTx.sign(wallet.privateKey);

      return '0x' + eTx.serialize().toString('hex');

      /*
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
      */
    }

    generateTokenRawTransaction(toAddress, value, gasPrice, gasLimit, tokenSymbol) {
      let token = TokenService.getBySymbol(tokenSymbol);
      // TODO check token exists
      // TODO check token balance

      let data = token.generateContractData(toAddress, value);

      let rawTx = {
        nonce: EthUtils.sanitizeHex(wallet.nonceHex), 
        gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPrice)),
        gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimit)),
        to: EthUtils.sanitizeHex(token.contractAddress),
        value: EthUtils.sanitizeHex(EthUtils.decimalToHex(value)),
        data: EthUtils.sanitizeHex(data),
        chainId: selectedChainId
      }

      console.log("generateTokenRawTransaction before", rawTx);
      let eTx = new Tx(rawTx);

      //new Buffer(wallet.privateKey, 'hex')
      eTx.sign(wallet.privateKey);

      return '0x' + eTx.serialize().toString('hex');
    }
  };

  return new WalletService();
}

export default WalletService;