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
          defer.reject($rootScope.buildErrorObject("ERR_IMPORTING_KEYSTORE_FILE", error));
        });
      });

      return defer.promise;
    }

    importUsingKeystoreFilePath(filePath) {
      let defer = $q.defer();

      let promise = ElectronService.importEtherKeystoreFile(filePath);
      promise.then((keystoreObject) => {
        wallet = new Wallet(keystoreObject);
        TokenService.init();

        // Broadcast about changes
        $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_LOADED, wallet);

        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_IMPORT_KEYSTORE_FILE", error));
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
        defer.reject($rootScope.buildErrorObject("ERR_UNLOCK_KEYSTORE_FILE", error));
      });

      return defer.promise;
    }

    loadBalance() {
      let defer = $q.defer();

      // TODO check wallet address
      let promise = EtherScanService.getBalance(wallet.getAddress());
      promise.then((balanceWei) => {
        $log.debug(balanceWei);

        wallet.balanceWei = balanceWei
        wallet.balanceEth = EthUnits.toEther(balanceWei, 'wei');

        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_BALANCE_LOAD", error));
      });

      return defer.promise;
    }

    loadTokenBalance(symbol) {
      // TODO check Address
      if (symbol) {
        TokenService.loadBalanceBySymbol(wallet.getAddress(), symbol);
      } else {
        TokenService.loadAllbalance(wallet.getAddress());
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
        defer.reject($rootScope.buildErrorObject("ERR_TX_COUNT_LOAD", error));
      });
      return defer.promise;
    }

    loadGasPrice() {
      let defer = $q.defer();
      // TODO check wallet address
      let promise = EtherScanService.getGasPrice();
      promise.then((data) => {
        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_GAS_PRICE_LOAD", error));
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
      let defer = $q.defer();

      let promise = this.loadTransactionCount();
      promise.then((wallet) => {
        //wallet.nonceHex

        let rawTx = {
          nonce: EthUtils.sanitizeHex(wallet.nonceHex),
          gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPrice)),
          gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimit)),
          to: EthUtils.sanitizeHex(toAddress),
          value: EthUtils.sanitizeHex(EthUtils.decimalToHex(EthUnits.toWei(value))),
          chainId: selectedChainId
        }

        if (data) {
          rawTx.data = EthUtils.sanitizeHex(data);
        }

        let eTx = new Tx(rawTx);
        eTx.sign(wallet.privateKey);

        defer.resolve('0x' + eTx.serialize().toString('hex'));
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_GENERATE_ETH_RAW_TX", error));
      });

      return defer.promise;
    }

    generateTokenRawTransaction(toAddress, value, gasPrice, gasLimit, tokenSymbol) {
      let defer = $q.defer();

      let token = TokenService.getBySymbol(tokenSymbol);
      if (!token) {
        defer.reject($rootScope.buildErrorObject("ERR_TOKEN_NOT_FOUND"));
      }

      // TODO check token balance

      let promise = this.loadTransactionCount();
      promise.then((wallet) => {
        let genResult = token.generateContractData(toAddress, value);
        if (genResult.error) {
          defer.reject($rootScope.buildErrorObject("ERR_TX_DATA_GENERATION", genResult.error));
        } else {
          let rawTx = {
            nonce: EthUtils.sanitizeHex(wallet.nonceHex),
            gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPrice)),
            gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimit)),
            to: EthUtils.sanitizeHex(token.contractAddress),
            value: EthUtils.sanitizeHex(EthUtils.decimalToHex(value)),
            data: EthUtils.sanitizeHex(genResult.data),
            chainId: selectedChainId
          }

          let eTx = new Tx(rawTx);
          //new Buffer(wallet.privateKey, 'hex')
          eTx.sign(wallet.privateKey);

          defer.resolve('0x' + eTx.serialize().toString('hex'));
        }
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_GENERATE_TOKEN_RAW_TX", error));
      });
    }
  };

  return new WalletService();
}

export default WalletService;