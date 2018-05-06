'use strict';

var Web3 = require('web3');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

const electron = require('electron');

const LedgerWalletSubproviderFactory = require('ledger-wallet-provider').default;

const CONFIG = require('../config');


module.exports = function (app) {

  const getNetworkId = () => {
    return CONFIG.chainId;
  }

  const getDefaultDerivationPath = () => {
    return "44'/60'/0'/0";
  }

  const engine = new ProviderEngine();
  const web3 = new Web3(engine);

  const controller = function () { };

  controller.prototype.connect = () => {
    return new Promise((resolve, reject) => {

      LedgerWalletSubproviderFactory(getNetworkId)
        .then((ledgerWalletSubProvider) => {
          engine.addProvider(ledgerWalletSubProvider);


          let rpcUrl = electron.app.web3Service.getSelectedServerURL();
          engine.addProvider(new RpcSubprovider({ rpcUrl }));
          engine.start();

          let ledger = ledgerWalletSubProvider.ledger;
          web3.eth.getMultipleAccounts = ledger.getMultipleAccounts.bind(ledger);

          resolve();

        }).catch((err) => {
          reject();
        });
    });
  }

  controller.prototype.getAccounts = (args) => {
    args = args || {};
    // if param is not present then use default one.
    let derivationPath = args.derivationPath || getDefaultDerivationPath();
    let data = {
      method: 'getMultipleAccounts',
      web3ETH: web3.eth,
      args: [derivationPath, args.start || 0, args.quantity || 1]
    };


    return electron.app.web3Service.waitForTicket(data);
  }

  controller.prototype.signTransaction = (args) => {
    args.dataToSign.from = args.address;
    let data = {
      method: 'signTransaction',
      args: [args.dataToSign]

    }
    return electron.app.web3Service.waitForTicket(args);
  }

  return controller;
};
