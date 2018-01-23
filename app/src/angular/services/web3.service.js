'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const EthUnits = requireAppModule('angular/classes/eth-units');
const EthUtils = requireAppModule('angular/classes/eth-utils');
const Token = requireAppModule('angular/classes/token');

function dec2hexString(dec) {
  return '0x' + (dec + 0x10000).toString(16).substr(-4).toUpperCase();
}

// documentation
// https://www.myetherapi.com/
function Web3Service($rootScope, $window, $q, $timeout, $log, $http, $httpParamSerializerJQLike, EVENTS, ElectronService, CommonService, $interval, ConfigFileService) {
  'ngInject';

  $log.info('Web3Service Initialized');

  /**
   * 
   */
  const REQUEST_INTERVAL_DELAY = 500;

  /**
   * 
   */
  const DEFAULT_NODE = "infura";

  /**
   * 1: main net
   * 2: test net
   */
  const DEFAULT_CHAIN_ID = 3;

  /**
   * 
   */
  const SERVER_CONFIG = {
    mew: {
      1: { url: "https://api.myetherapi.com/eth" },
      3: { url: "https://api.myetherapi.com/rop" }
    },
    infura: {
      1: { url: "https://mainnet.infura.io" },
      3: { url: "https://ropsten.infura.io" }
    }
  }

  let SELECTED_CHAIN_ID = null;
  let SELECTED_SERVER_URL = null;

  setChainId(DEFAULT_NODE, DEFAULT_CHAIN_ID);

  function setChainId(node, chainId) {
    SELECTED_CHAIN_ID = chainId;
    SELECTED_SERVER_URL = SERVER_CONFIG[node][chainId].url;
  }

  let lastRequestTime = 0;
  const requestQueue = [];

  /**
   * 
   */
  class Web3Service {

    constructor() {
      Web3Service.web3 = new Web3();
      Web3Service.web3.setProvider(new Web3Service.web3.providers.HttpProvider(SELECTED_SERVER_URL));

      $rootScope.$on(EVENTS.CHAIN_ID_CHANGED, (event, newChainId) => {
        setChainId(DEFAULT_NODE, newChainId);
      });

      Token.Web3Service = this;
      Token.$q = $q;

      Wallet.Web3Service = this;
      console.log("00000000")
      Web3Service.q = async.queue((data, callback) => {
        console.log("11111111")
        let promise = Web3Service.web3.eth[data.method].apply(this, data.args);

        $timeout(() => {
          callback(promise);
        }, REQUEST_INTERVAL_DELAY);

      }, 1);
      console.log("222222222")
    }

    syncWalletActivity() {
      let store = ConfigFileService.getStore();
      let walletKeys = Object.keys(store.wallets);
      let wallets = store.wallets;
      if (!walletKeys.length) {
        return;
      }
      $rootScope.walletActivityIsSynced = false;

      let prefix = '0x';
      let valueDivider = 10 ** 18;

      walletKeys.forEach((key) => {
        let wallet = wallets[key];
        let data = wallet.data = wallet.data || {};
        let activities = data.activities = data.activities || {};

        //reset transactions we will calculate from saved blocks
        activities.transactions = [];
        activities.blocks = activities.blocks || {};

        //remove last block we are processing again 
        if (activities.lastBlockNumber) {
          delete activities.blocks[activities.lastBlockNumber];
        }
      });

      let anyWallet = wallets[walletKeys[0]];
      let previousLastBlockNumber = anyWallet.data.activities.lastBlockNumber;

      let updateLastBlockNumber = (lastBlockNumber) => {
        walletKeys.forEach((key) => {
          let wallet = wallets[key];
          wallet.data.activities.lastBlockNumber = lastBlockNumber;
        });
      };

      let addNewTransaction = (blockNumber, key, transaction) => {

        let wallet = wallets[key];
        let blocks = wallet.data.activities.blocks;

        if (key == transaction.to) {
          delete transaction.to;
        }
        if (key == transaction.from) {
          delete transaction.from;
        }

        let block = blocks[blockNumber] = blocks[blockNumber] || {};
        block[transaction.hash] = transaction;
      };

      Web3Service.getMostRecentBlockNumber().then((blockNumber) => {
        previousLastBlockNumber = previousLastBlockNumber || blockNumber;
        let blockNumbersToProcess = [];
        for (let i = previousLastBlockNumber; i <= blockNumber; i++) {
          blockNumbersToProcess.push(i);
        }
        updateLastBlockNumber(blockNumber);

        (function next() {
         
          if (blockNumbersToProcess.length === 0) {
            walletKeys.forEach((key) => {
              let wallet = wallets[key];
              let blocks = wallet.data.activities.blocks;
              let transactions = wallet.data.activities.transactions;

              let blockKeys = Object.keys(blocks);
              blockKeys.forEach(blockKey => {
                let transactionHashes = blocks[blockKey];
                Object.keys(transactionHashes).forEach(hash => {
                  let transaction = transactionHashes[hash];
                  transactions.push(transaction);
                });
              });
            });

            ConfigFileService.save().then((store) => {
              $rootScope.walletActivityIsSynced = true;
            }).catch((error) => {
            });
            return;
          }

          let currentBlockNumber = blockNumbersToProcess.shift();
          Web3Service.getBlock(currentBlockNumber, true).then((blockData) => {
            if (blockData) {
              if (blockData && blockData.transactions) {
                blockData.transactions.forEach(transaction => {
                  let from = transaction.from ? transaction.from.toLowerCase() : null;
                  let to = transaction.to ? transaction.to.toLowerCase() : null;

                  walletKeys.forEach((walletKey) => {
                    let fullAddressHex = (prefix + walletKey).toLowerCase();

                    if (from == fullAddressHex || to == fullAddressHex) {
                      addNewTransaction(currentBlockNumber, walletKey, {
                        to: transaction.to,
                        from: transaction.from,
                        timestamp: blockData.timestamp, 
                        hash: transaction.hash,
                        value: transaction.value / valueDivider 
                      });
                    }
                  });
                });
              }
            }
            next();
          });

        })();
      });
    }

    static getBlock(blockNumber, withTransactions) {
      withTransactions = withTransactions || false;
      let defer = $q.defer();

      // wei
      Web3Service.waitForTicket(defer, 'getBlock', [blockNumber, withTransactions]);

      return defer.promise;
    }

    static getMostRecentBlockNumber() {
      let defer = $q.defer();

      // wei
      Web3Service.waitForTicket(defer, 'getBlockNumber', []);

      return defer.promise;
    }

    getBalance(addressHex) {
      let defer = $q.defer();

      // wei
      Web3Service.waitForTicket(defer, 'getBalance', [addressHex]);

      return defer.promise;
    }

    getTokenBalanceByData(data) {
      let defer = $q.defer();

      // wei
      Web3Service.waitForTicket(defer, 'call', [data]);

      return defer.promise;
    }

    getEstimateGas(fromAddressHex, toAddressHex, amountHex) {
      let defer = $q.defer();

      let args = {
        "from": fromAddressHex,
        "to": toAddressHex,
        "value": amountHex
      }

      // wei
      Web3Service.waitForTicket(defer, 'estimateGas', [args]);

      return defer.promise;
    }

    getGasPrice() {
      let defer = $q.defer();

      // wei
      Web3Service.waitForTicket(defer, 'getGasPrice', []);

      return defer.promise;
    }

    getTransactionCount(addressHex) {
      let defer = $q.defer();

      // number
      Web3Service.waitForTicket(defer, 'getTransactionCount', [addressHex, 'pending']);

      return defer.promise;
    }

    sendRawTransaction(signedTxHex) {
      let defer = $q.defer();

      Web3Service.waitForTicket(defer, 'sendSignedTransaction', [signedTxHex]);

      return defer.promise;
    }

    getTransaction(transactionHex) {
      let defer = $q.defer();

      Web3Service.waitForTicket(defer, 'getTransaction', [transactionHex]);

      return defer.promise;
    }

    getTransactionReceipt(transactionHex) {
      let defer = $q.defer();

      Web3Service.waitForTicket(defer, 'getTransactionReceipt', [transactionHex]);

      return defer.promise;
    }

    static handlePromise(defer, promise) {
      promise.then((response) => {
        $log.info("response", response);
        defer.resolve(response)
      }).catch((error) => {
        $log.error("error", error);
        defer.reject(error);
      });
    }

    static waitForTicket(defer, method, args) {
      Web3Service.q.push({ method: method, args: args }, (promise) => {
        Web3Service.handlePromise(defer, promise);
      });
    }
  };

  return new Web3Service();
}

module.exports = Web3Service;