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

  const engine = new ProviderEngine();
  const web3 = new Web3(engine);

  const controller = function () { };

  controller.prototype.connect = (derivationPath) => {
    derivationPath = derivationPath || "44'/60'/0'/0";
    return new Promise((resolve, reject) => {

      LedgerWalletSubproviderFactory(getNetworkId, derivationPath)
        .then((ledgerWalletSubProvider) => {
          engine.addProvider(ledgerWalletSubProvider);


          let rpcUrl = electron.app.web3Service.getSelectedServerURL();
          engine.addProvider(new RpcSubprovider({ rpcUrl }));
          engine.start();

          let ledger = ledgerWalletSubProvider.ledger;


          /*ledger.getLedgerConnection().then((a,b)=>{


          
          }).catch((err)=>{
          })*/
          resolve();

        }).catch((err) => {
          reject();
        });
    });
  }

  controller.prototype.getAccounts = () => {
    let args = {
      method: 'getAccounts',
      web3ETH: web3.eth
    };

    return electron.app.web3Service.waitForTicket(args);
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
