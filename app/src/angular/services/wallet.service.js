'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const EthUnits = requireAppModule('angular/classes/eth-units');
const EthUtils = requireAppModule('angular/classes/eth-utils');
const Token = requireAppModule('angular/classes/token');

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
        if (this.wallet && this.wallet.getPublicKeyHex()) {
          this.loadBalance();
        }
      });
    }

    createKeystoreFile(password) {
      let defer = $q.defer();

      let promise = ElectronService.generateEthereumWallet(password);
      promise.then((data) => {
        if (data && data.privateKey && data.publicKey) {
          wallet = new Wallet(data.privateKey, data.publicKey);

          TokenService.init();

          // Broadcast about changes
          $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_LOADED, wallet);

          defer.resolve(wallet);
        } else {
          defer.reject("no data in resp");
        }
      }).catch((error) => {
        defer.reject(error);
      });

      return defer.promise;
    }

    importUsingKeystoreFileDialog() {
      let defer = $q.defer();

      let promise = ElectronService.openFileSelectDialog();

      promise.then((resp) => {
        this.importUsingKeystoreFilePath(resp.path).then((wallet) => {
          defer.resolve(wallet);
        }).catch((error) => {
          defer.reject("ERR_IMPORTING_KEYSTORE_FILE");
        });
      });

      return defer.promise;
    }

    importUsingKeystoreFilePath(filePath) {
      let defer = $q.defer();

      let promise = ElectronService.importEtherKeystoreFile(filePath);
      promise.then((data) => {
        wallet = new Wallet(data.privateKey, data.publicKey);

        TokenService.init();

        $rootScope.wallet = wallet;

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
        this.loadBalance();

        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject("ERR_UNLOCK_KEYSTORE_FILE");
      });

      return defer.promise;
    }

    unlockByFilePath(filePath, password) {
      let defer = $q.defer();

      let importPromise = ElectronService.importEtherKeystoreFile(filePath);
      importPromise.then((response) => {
        let promise = ElectronService.unlockEtherKeystoreObject(response.keystoreObject, password);
        promise.then((data) => {
          wallet = new Wallet(data.privateKey, data.publicKey);

          $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_UNLOCKED, wallet);
          this.loadBalance();

          $rootScope.wallet = wallet;

          defer.resolve(wallet);
        }).catch((error) => {
          defer.reject("ERR_UNLOCK_KEYSTORE_FILE");
        });
      }).catch((error) => {
        defer.reject("ERR_UNLOCK_KEYSTORE_FILE");
      });

      return defer.promise;
    }

    unlockByPrivateKey(privateKey) {
      let defer = $q.defer();

      let importPromise = ElectronService.importEtherPrivateKey(privateKey);
      importPromise.then((data) => {
        wallet = new Wallet(data.privateKeyBuffer, data.publicKey);
        $rootScope.$broadcast(EVENTS.KEYSTORE_OBJECT_UNLOCKED, wallet);
        this.loadBalance();

        $rootScope.wallet = wallet;

        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject("ERR_UNLOCK_PRIVATE_KEY");
      });

      return defer.promise;
    }

    loadBalance() {
      let defer = $q.defer();

      // TODO check wallet address
      let promise = Web3Service.getBalance("0x" + wallet.getPublicKeyHex());
      promise.then((balanceWei) => {
        wallet.balanceEth = EthUnits.toEther(balanceWei, 'wei');
        wallet.balanceEth = Number(CommonService.numbersAfterComma(wallet.balanceEth, 8));

        if (wallet.balanceWei !== balanceWei && !isFirstLoad) {
          ElectronService.showNotification('Identity Wallet', 'ETH Balance Changed ' + wallet.balanceEth, {});
        }

        wallet.balanceWei = balanceWei;

        isFirstLoad = false;

        defer.resolve(wallet);
      }).catch((error) => {
        defer.reject(error);
      });

      return defer.promise;
    }

    loadTokenBalance(symbol) {
      // TODO check Address
      if (symbol) {
        TokenService.loadBalanceBySymbol(wallet.getPublicKeyHex(), symbol);
      } else {
        TokenService.loadAllbalance(wallet.getPublicKeyHex());
      }
    }

    getTransactionCount() {
      let defer = $q.defer();
      // TODO check wallet address
      let promise = Web3Service.getTransactionCount(wallet.getPublicKeyHex());
      promise.then((nonce) => {
        defer.resolve(nonce);
      }).catch((error) => {
        defer.reject(error);
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
        defer.reject(error);
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

        let eTx = new Tx(rawTx);
        eTx.sign(wallet.privateKey);

        defer.resolve('0x' + eTx.serialize().toString('hex'));
      }).catch((error) => {
        defer.reject(error);
      });

      return defer.promise;
    }

    generateTokenRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, tokenSymbol) {
      let defer = $q.defer();

      let token = TokenService.getBySymbol(tokenSymbol);
      if (!token) {
        defer.reject("ERR_TOKEN_NOT_FOUND");
      }

      // TODO check token balance

      let promise = this.getTransactionCount();
      promise.then((nonce) => {
        let genResult = token.generateContractData(toAddressHex, valueWei);
        if (genResult.error) {
          defer.reject(genResult.error);
        } else {
          let rawTx = {
            nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
            gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
            gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
            to: EthUtils.sanitizeHex(token.contractAddress),
            value: "0x00",
            data: EthUtils.sanitizeHex(genResult.data),
            chainId: selectedChainId
          }

          let eTx = new Tx(rawTx);
          //new Buffer(wallet.privateKey, 'hex')
          eTx.sign(wallet.privateKey);

          defer.resolve('0x' + eTx.serialize().toString('hex'));
        }
      }).catch((error) => {
        console.log(error);
        defer.reject(error);
      });

      return defer.promise;
    }
  };

  return new WalletService();
}

module.exports = WalletService;