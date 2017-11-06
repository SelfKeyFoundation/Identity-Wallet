'use strict';

function ElectronService($rootScope, $window, $q, $timeout, $log, CONFIG, ConfigStorageService, IndexedDBService) {
  'ngInject';

  if (!window.ipcRenderer) return;

  $log.debug('ElectronService Initialized', window.ipcRenderer);
  let ipcRenderer = window.ipcRenderer

  let listeners = {};

  /**
   * 
   */
  let ElectronService = function () {
    this.ipcRenderer = ipcRenderer;

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

    this.openDirectorySelectDialog = function (event) {
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

    this.generateEthereumWallet = function (password, destDir) {
      return makeCall('signPdf', {
        password: password,
        destDir: destDir
      });
    }

    this.importEthereumWallet = function (password, walletSrc) {
      // TODO
    }

    /**
     * Callback Events
     */
    this.callback = {
      onHandshake: null
    };
  }

  /**
     * Incoming Events
     */
  ipcRenderer.on('ON_READY', handshake);

  ipcRenderer.on("ON_ASYNC_REQUEST", (event, actionId, actionName, error, data) => {
    listeners[actionId].defer.resolve(data);
    $timeout(() => {
      delete listeners[actionId];
    }, 1000);
  });

  /**
   * 
   */
  function handshake(event) {
    // send configs to electron app
    ipcRenderer.send('ON_CONFIG_CHANGE', ConfigStorageService);
  }

  function onUsersDocumentsDirectoryChange(event, folderPath) {
    if (folderPath) {
      let promise = ConfigStorageService.setUserDocumentsStoragePath(folderPath);
      promise.then((data) => {
        ipcRenderer.send("ON_CONFIG_CHANGE", data);
      });
    }
  }

  /**
   * 
   */
  function makeCall(actionName, data) {
    let defer = $q.defer();
    let id = IndexedDBService.generateId();

    listeners[id] = {
      defer: $q.defer()
    }

    ipcRenderer.send("ON_ASYNC_REQUEST", id, actionName, data);

    return listeners[id].defer.promise;
  }

  return new ElectronService();
}

export default ElectronService;