'use strict';

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
    this.ipcRenderer = ipcRenderer;

    this.readConfig = function() {
        const filepath = localStorageService.get(CONFIG.constants.localStorageKeys.USER_DOCUMENTS_STORAGE_PATH);
        return makeCall('readConfig', { filepath: filepath });
    }

    this.saveConfig = function(data) {
      const filepath = localStorageService.get(CONFIG.constants.localStorageKeys.USER_DOCUMENTS_STORAGE_PATH);
      return makeCall('saveConfig', { filepath: filepath, data: data });
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
    listeners[actionId].defer.resolve(data);
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