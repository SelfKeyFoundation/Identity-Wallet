'use strict';

function ElectronService($rootScope, $window, $q, $timeout, $log, CONFIG, ConfigStorageService, IndexedDBService) {
  'ngInject';

  if (!window.ipcRenderer) return;

  $log.debug('ElectronService Initialized', window.ipcRenderer);

  const EVENTS = CONFIG.constants.events;
  let ipcRenderer = window.ipcRenderer

  let listeners = {};

  /**
   * 
   */
  let ElectronService = function () {
    this.ipcRenderer = ipcRenderer;

    /**
     * Actions
     */
    this.sendConfigChange = function (config) {
      // TODO - "ON_CONFIG_CHANGE" - move to constants 
      ipcRenderer.send("ON_CONFIG_CHANGE", config);
    };

    // TODO - !! CHANGE !!
    this.test = function (config) {
      // TODO - "ON_CONFIG_CHANGE" - move to constants 
      ipcRenderer.send("ON_CONFIG_READY", config);
    };

    // TODO - !! CHANGE !!
    this.sendChooseFilePathRequest = function () {
      let defer = $q.defer();

      // TODO - "CHOOSE_FILE_PATH" - move to constants 
      ipcRenderer.send("CHOOSE_FILE_PATH");

      ipcRenderer.on("CHOOSE_FILE_PATH", (event, filePath) => {
        ipcRenderer.removeAllListeners("CHOOSE_FILE_PATH");
        defer.resolve(filePath);
      });

      return defer.promise;
    }

    // TODO - !! CHANGE !!
    this.sendMoveFileRequest = function (src, dest) {
      let defer = $q.defer();

      // TODO - "CHOOSE_FILE_PATH" - move to constants 
      ipcRenderer.send("MOVE_FILE", { src: src, dest: dest });

      ipcRenderer.on("MOVE_FILE", (event, error, filePath) => {
        ipcRenderer.removeAllListeners("MOVE_FILE");
        if (error) {
          defer.reject(error);
        } else {
          defer.resolve(filePath);
        }
      });

      return defer.promise;
    }

    /**
     * 
     */
    this.checkFileStat = function (filePath) {
      let defer = $q.defer();
      let id = IndexedDBService.generateId();

      listeners[id] = {
        defer: $q.defer()
      }

      // TODO - "CHECK_FILE_STAT" - move to constants 
      ipcRenderer.send("ON_ASYNC_REQUEST", id, 'CHECK_FILE_STAT', { src: filePath });

      return listeners[id].defer.promise;
    }

    this.openDirectorySelectDialog = function (event) {
      let defer = $q.defer();
      let id = IndexedDBService.generateId();

      listeners[id] = {
        defer: $q.defer()
      }

      // TODO - "OPEN_DIRECTORY_SELECT_DIALOG" - move to constants 
      ipcRenderer.send("ON_ASYNC_REQUEST", id, 'OPEN_DIRECTORY_SELECT_DIALOG', null);

      return listeners[id].defer.promise;
    }


    /**
     * Callback Events
     */
    this.callback = {
      onHandshake: null
    };

    /**
     * Incoming Events
     */
    ipcRenderer.on(EVENTS.ON_ELECTRON_APP_READY, handshake);
    ipcRenderer.on(EVENTS.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE, onUsersDocumentsDirectoryChange);
  }

  ipcRenderer.on("ON_ASYNC_REQUEST", (event, actionId, actionName, error, data) => {
    listeners[actionId].defer.resolve(data);

    $timeout(() => {
      delete listeners[actionId];
    }, 1000);
  });

  function handshake(event) {
    // send configs to electron app
    ipcRenderer.send(EVENTS.ON_CONFIG_READY, ConfigStorageService);
  }

  function onUsersDocumentsDirectoryChange(event, folderPath) {
    if (folderPath) {
      let promise = ConfigStorageService.setUserDocumentsStoragePath(folderPath);
      promise.then((data) => {
        // TODO - "ON_CONFIG_CHANGE" - move to constants 
        ipcRenderer.send("ON_CONFIG_CHANGE", data);
      });
    }
  }

  return new ElectronService();
}

export default ElectronService;