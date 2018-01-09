'use strict';

import Wallet from '../classes/wallet';

function ElectronService($rootScope, $window, $q, $timeout, $log, CONFIG, localStorageService) {
  'ngInject';

  if (!window.ipcRenderer) return;

  $log.debug('ElectronService Initialized', window.ipcRenderer);
  let ipcRenderer = window.ipcRenderer

  let listeners = {};

  /**
   * 
   */
  let ElectronService = function () {

    Wallet.ElectronService = this;

    this.ipcRenderer = ipcRenderer;

    this.initDataStore = function () {
      return makeCall('initDataStore');
    }

    this.readDataStore = function() {
        return makeCall('readDataStore');
    }

    this.saveDataStore = function(data) {
      return makeCall('saveDataStore', { data: data });
    }

    /**
     * 
     */
    this.sendConfigChange = function (config) {
      ipcRenderer.send("ON_CONFIG_CHANGE", config);
    };

    /**
     * 
     */
    this.moveFile = function (src, dest) {
      return makeCall('moveFile', { src: src, dest: dest, copy: true });
    }

    this.checkFileStat = function (filePath) {
      return makeCall('checkFileStat', { src: filePath });
    }

    this.openDirectorySelectDialog = function () {
      return makeCall('openDirectorySelectDialog', null);
    }

    this.openFileSelectDialog = function (event) {
      return makeCall('openFileSelectDialog', null);
    }

    this.signPdf = function (input, output, certificate, password) {
      return makeCall('signPdf', {
        input: input,
        output: output,
        certificate: certificate,
        password: password
      });
    }

    this.generateEthereumWallet = function (password, keyStoreSrc) {
      return makeCall('generateEthereumWallet', {
        password: password,
        keyStoreSrc: keyStoreSrc
      });
    }

    this.importEthereumWallet = function (address, password, keyStoreSrc) {
      return makeCall('importEthereumWallet', {
        address: address,
        password: password,
        keyStoreSrc: keyStoreSrc
      });
    }

    this.importEtherKeystoreFile = function (filePath) {
      return makeCall('importEtherKeystoreFile', {
        filePath: filePath
      });
    }

    this.showNotification = function (title, text, options) {
      return makeCall('showNotification', {
        title: title,
        text: text,
        options: options
      });
    }

    this.analytics = function (event, data) {
      return makeCall('analytics', {
        event: event,
        data: data
      });
    }

    this.unlockEtherKeystoreObject = function (keystoreObject, password) {
      return makeCall('unlockEtherKeystoreObject', {
        keystoreObject: keystoreObject,
        password: password
      });
    }

    this.importEtherPrivateKey = function (privateKey) {
      return makeCall('importEtherPrivateKey', {
        privateKey: privateKey
      });
    }

    this.closeApp = function () {
      return makeCall('closeApp', {});
    }
  }

  /**
   * Incoming Events
   */
  ipcRenderer.on('ON_READY', (event) => {
    // send configs to electron app
    console.log(event);
    //ipcRenderer.send('ON_CONFIG_CHANGE', ConfigStorageService);
  });

  ipcRenderer.on("ON_ASYNC_REQUEST", (event, actionId, actionName, error, data) => {
    if (error) {
      listeners[actionId].defer.reject(error);
    } else {
      listeners[actionId].defer.resolve(data);
    }
    $timeout(() => {
      delete listeners[actionId];
    }, 1000);
  });

  /**
   * 
   */
  function makeCall(actionName, data) {
    let defer = $q.defer();
    let id = generateId();

    listeners[id] = {
      defer: $q.defer()
    }

    ipcRenderer.send("ON_ASYNC_REQUEST", id, actionName, data);

    return listeners[id].defer.promise;
  }

  function generateId(m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) {
    return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
  }

  return new ElectronService();
}

export default ElectronService;