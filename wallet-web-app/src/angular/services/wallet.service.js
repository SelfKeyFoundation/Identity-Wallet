'use strict';

import Wallet from '../classes/wallet.js';
import EthUtils from '../classes/eth-utils.js';
import EthUnits from '../classes/eth-units.js';
import Token from '../classes/token.js';

import Tx from 'ethereumjs-tx';

function WalletService($rootScope, $log, $q, $timeout, EVENTS, ElectronService, EtherScanService, TokenService, Web3Service, CommonService) {
  'ngInject';

  $log.info('WalletService Initialized');

  let wallet = null;
  let selectedChainId = 3;

  let isFirstLoad = true;

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
        if(this.wallet && this.wallet.getAddress()){
          this.loadBalance();
        }
      });
    }

    createKeystoreFile(password) {
      let defer = $q.defer();

      let promise = ElectronService.generateEthereumWallet(password);
      promise.then((data) => {
        if (data && data.keystore) {
          wallet = new Wallet(data.keystore);
          wallet.setPrivateKey(data.privateKey);
          
          TokenService.init();
          // Broadcast about changes
          $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_LOADED, wallet);
          defer.resolve(wallet);
        }
      }).catch((error) => {
        // TODO
        defer.reject(error);
      });

      return defer.promise;
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

        $rootScope.wallet = wallet;

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
        this.loadBalance();

        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_UNLOCK_KEYSTORE_FILE", error));
      });

      return defer.promise;
    }

    loadBalance() {
      let defer = $q.defer();

      // TODO check wallet address
      let promise = Web3Service.getBalance("0x" + wallet.getAddress());
      promise.then((balanceWei) => {
        wallet.balanceEth = EthUnits.toEther(balanceWei, 'wei');
        wallet.balanceEth = Number(CommonService.numbersAfterComma(wallet.balanceEth, 8));

        if(wallet.balanceWei !== balanceWei && !isFirstLoad){
          ElectronService.showNotification('Identity Wallet', 'ETH Balance Changed ' + wallet.balanceEth, {});
        }
        
        wallet.balanceWei = balanceWei;

        isFirstLoad = false;
        
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

    getTransactionCount() {
      let defer = $q.defer();
      // TODO check wallet address
      let promise = Web3Service.getTransactionCount(wallet.getAddress());
      promise.then((nonce) => {  
        defer.resolve(nonce);
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_TX_COUNT_LOAD", error));
      });
      return defer.promise;
    }

    getGasPrice() {
      let defer = $q.defer();
      // TODO check wallet address
      let promise = Web3Service.getGasPrice();
      promise.then((data) => {
        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_GAS_PRICE_LOAD", error));
      });
      return defer.promise;
    }

    /**
     * 
     * @param {hex} toAddressHex
     * @param {eth} valueWei 
     * @param {wei} gasPriceWei 
     * @param {wei} gasLimitWei 
     * @param {hex} contractDataHex Contract data
     */
    generateEthRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, contractDataHex) {
      let defer = $q.defer();

      let promise = this.getTransactionCount();
      promise.then((nonce) => {
        //wallet.nonceHex

        let rawTx = {
          nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
          gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
          gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
          to: EthUtils.sanitizeHex(toAddressHex),
          value: EthUtils.sanitizeHex(EthUtils.decimalToHex(valueWei)),
          chainId: selectedChainId
        }

        if (contractDataHex) {
          rawTx.data = EthUtils.sanitizeHex(contractDataHex);
        }

        console.log("????????", rawTx, "<<<<<")

        let eTx = new Tx(rawTx);
        eTx.sign(wallet.privateKey);

        defer.resolve('0x' + eTx.serialize().toString('hex'));
      }).catch((error) => {
        defer.reject($rootScope.buildErrorObject("ERR_GENERATE_ETH_RAW_TX", error));
      });

      return defer.promise;
    }

    generateTokenRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, tokenSymbol) {
      let defer = $q.defer();

      let token = TokenService.getBySymbol(tokenSymbol);
      if (!token) {
        defer.reject($rootScope.buildErrorObject("ERR_TOKEN_NOT_FOUND"));
      }

      // TODO check token balance

      let promise = this.getTransactionCount();
      promise.then((nonce) => {
        let genResult = token.generateContractData(toAddressHex, valueWei);
        if (genResult.error) {
          defer.reject($rootScope.buildErrorObject("ERR_TX_DATA_GENERATION", genResult.error));
        } else {
          let rawTx = {
            nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
            gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
            gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
            to: EthUtils.sanitizeHex(token.contractAddress),
            value: EthUtils.sanitizeHex(EthUtils.decimalToHex(valueWei)),
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