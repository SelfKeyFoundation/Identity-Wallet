'use strict';

const electron = require('electron');
const ledgerco = require('ledgerco');
const EthereumTx = require('ethereumjs-tx');
const { timeout, TimeoutError } = require('promise-timeout');

const a = require('@ledgerhq/hw-transport');


const CONFIG = require('../config');

module.exports = function (app) {
  let eth = null;
  let comm = null;
  const getNetworkId = () => {
    return CONFIG.chainId;
  }

  const getDefaultDerivationPath = () => {
    return "44'/60'/0'/0";
  }


  const controller = function () { };


  async function getEth() {
    if (comm) {
      await comm.close_async();
    }

    comm = await ledgerco.comm_node.create_async();

    eth = new ledgerco.eth(comm);
    
    return eth;
  }



  function obtainPathComponentsFromDerivationPath(derivationPath) {
    // check if derivation path follows 44'/60'/x'/n pattern
    const regExp = /^(44'\/6[0|1]'\/\d+'?\/)(\d+)$/;
    const matchResult = regExp.exec(derivationPath);
    if (matchResult === null) {
      throw new Error(
        "To get multiple accounts your derivation path must follow pattern 44'/60|61'/x'/n "
      );
    }

    return { basePath: matchResult[1], index: parseInt(matchResult[2], 10) };
  }



  controller.prototype.getAccounts = async function (args) {
    args = args || {};

    let indexOffset = args.start || 0;
    let accountsNo = args.quantity || 1;
    let eth = await getEth();

    let derivationPath = args.derivationPath || getDefaultDerivationPath();
    const pathComponents = obtainPathComponentsFromDerivationPath(derivationPath);

    let addresses = {};
    for (let i = indexOffset; i < indexOffset + accountsNo; i += 1) {
      let path = pathComponents.basePath + (pathComponents.index + i).toString();
      // eslint-disable-next-line no-await-in-loop
      let address = await eth.getAddress_async(
        path//,
        //this.askForOnDeviceConfirmation,
        //chainCode
      );
      addresses[path] = address.address;
    }
    return addresses;
  };



  async function _signTransaction(txData, derivationPath) {
    let eth = await getEth();
    let account = await eth.getAddress_async(derivationPath);
    console.log('very important hereeeeeeeeeeeeeeeeeeeeeee');
    console.log(account,txData.from);
    if (!account || account.address != txData.from) {
      throw new Error('invalid address');
    }

    // Encode using ethereumjs-tx
    const tx = new EthereumTx(txData);
    const chainId = parseInt(getNetworkId(), 10);

    // Set the EIP155 bits
    tx.raw[6] = Buffer.from([chainId]); // v
    tx.raw[7] = Buffer.from([]); // r
    tx.raw[8] = Buffer.from([]); // s

    // Encode as hex-rlp for Ledger
    const hex = tx.serialize().toString("hex");

    
    // Pass to _ledger for signing
    let result = null;
    try {
    result = await eth.signTransaction_async("44'/60'/0'/0", hex); // TODO path
    } catch(err) {
      throw new Error(
        "Custom error tato"
      );
    }
    // Store signature in transaction
    tx.v = Buffer.from(result.v, "hex");
    tx.r = Buffer.from(result.r, "hex");
    tx.s = Buffer.from(result.s, "hex");

    // EIP155: v should be chain_id * 2 + {35, 36}
    const signedChainId = Math.floor((tx.v[0] - 35) / 2);
    if (signedChainId !== chainId) {
      throw new Error(
        "Invalid signature received. Please update your Ledger Nano S."
      );
    }

    // Return the signed raw transaction
    return `0x${tx.serialize().toString("hex")}`;
  }


  controller.prototype.signTransaction = async (args) => {
    args.dataToSign.from = args.address;
    let derivationPath = args.derivationPath;
    return new Promise((resolve, reject) => {

      let signPromise = _signTransaction(args.dataToSign, derivationPath);

      timeout(signPromise, 30000)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log('catch is err', err);
          if (err instanceof TimeoutError) {
            console.log('aq ar mevida es yle');
            return reject('Timed out!');
          }
          reject(err);
        });

    });






  };

  return controller;
};
