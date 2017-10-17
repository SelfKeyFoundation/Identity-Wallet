'use strict';

function ElectronService($rootScope, $window, $timeout, $log, CONFIG, ConfigStorageService) {
  'ngInject';

  if(!window.ipcRenderer) return;

  $log.debug('ElectronService Initialized', window.ipcRenderer);

  const EVENTS = CONFIG.constants.events;

  let config = {};
  let ipcRenderer = window.ipcRenderer

  /**
   * 
   */
  prepareConfig ();

  let ElectronService = function () {
    this.isReady = false;
    this.ipcRenderer = ipcRenderer;

    /**
     * Actions
     */
    this.openUsersDocumentDirectoryChangeDialog = function (event) {
      ipcRenderer.send(EVENTS.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE_REQUEST);
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

  function handshake (event) {
    this.isReady = true;

    // send configs to electron app
    ipcRenderer.send(EVENTS.ON_CONFIG_READY, config);
  }

  function onUsersDocumentsDirectoryChange (event, folderPath) {
    if (folderPath) {
      ConfigStorageService.setUserDocumentsStoragePath(folderPath);
      config.documentsStorageLocation = folderPath;
      ipcRenderer.send(EVENTS.ON_CONFIG_READY, config);
    }
  }

  function prepareConfig () {
    config.documentsStorageLocation = ConfigStorageService.getUserDocumentsStoragePath();
  }

  return new ElectronService();
}

export default ElectronService;