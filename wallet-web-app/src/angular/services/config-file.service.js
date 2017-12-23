'use strict';
import IdAttributeType from '../classes/id-attribute-type.js';
import Ico from '../classes/ico.js';

function ConfigFileService($rootScope, $log, $q, $timeout, CONFIG, ElectronService, CommonService, SelfkeyService) {
  'ngInject';

  $log.debug('ConfigFileService Initialized');

  let store = null;
  let isReady = false;

  let idAttributeTypes = {};
  let icos = {
    active: [],
    upcoming: [],
    finished: []
  };

  class ConfigFileStore {

    constructor() {
      this.loadSelfkeyData();
    }

    init() {
      let defer = $q.defer();

      if (ElectronService.ipcRenderer) {
        ElectronService.initDataStore().then((data) => {
          store = data;

          // custom delay - to make visible loading
          $timeout(() => {
            defer.resolve(store);
            $rootScope.$broadcast('config-file-loaded');
            isReady = true;
          }, 3000);

        }).catch((error) => {
          // TODO
          defer.reject(error);
        });
      } else {
        defer.reject({ message: 'electron not available' });
      }
      return defer.promise;
    }

    loadSelfkeyData(reload) {
      // 1: Load Id Attribute Types
      SelfkeyService.dispatchIdAttributeTypes(reload).then((data) => {
        idAttributeTypes = data;
      });

      // 2: Load ICOs
      SelfkeyService.dispatchIcos(reload).then((data) => {
        for (let i in data) {
          switch (data[i].status) {
            case 'In Progress':
              icos.active.push(data[i]);
              break;
            case 'Upcoming':
              icos.upcoming.push(data[i]);
              break;
            case 'Finished':
              icos.finished.push(data[i]);
              break;
          }
        }
      });

      $rootScope.icos = icos;
    }

    save() {
      return ElectronService.saveDataStore(store);
    }

    load() {
      let defer = $q.defer();
      ElectronService.readDataStore().then((data) => {
        store = data;
        defer.resolve(store);
      }).catch((error) => {
        // TODO
        defer.reject(error);
      });
      return defer.promise;
    }

    getStore() {
      return store;
    }

    addIdAttribute(idAttribute) {
      store.idAttributes[idAttribute.subcategory] = idAttribute;
    }

    addItemToIdAttribute(subcategory, item) {
      if (store.idAttributes[subcategory]) {
        item._id = CommonService.generateId();
        store.idAttributes[subcategory][item._id] = item;
      } else {
        // throw error
      }
    }

    findIdAttributeItemById(subcategory, id) {
      if (store.idAttributes[subcategory]) {
        return store.idAttributes[subcategory][id];
      }
      return null;
    }

    getDefaultIdAttributeItem(subcategory) {
      if (!store.idAttributes[subcategory]) {
        return null;
      }

      let idAttribute = store.idAttributes[subcategory];
      return idAttribute.items[idAttribute.defaultItemId];
    }

    getIdAttribute(subcategory) {
      return store.idAttributes[subcategory];
    }

    getWalletPublicKeys() {
      return Object.keys(store.wallets);
    }

    getWalletsMetaData() {
      let keys = this.getWalletPublicKeys();
      let result = [];
      for (let i in keys) {
        let key = keys[i];
        result.push({
          name: store.wallets[key].name,
          keystoreFilePath: store.wallets[key].keystoreFilePath,
          publicKey: key
        });
      }
      return result;
    }

    getWalletsMetaDataByPublicKey(publicKey) {
      return store.wallets[publicKey];
    }

    /**
     * 
     */
    getIdAttributeTypes() {
      return idAttributeTypes;
    }

    getIdAttributeType(type) {
      return idAttributeTypes[type];
    }

    /**
     * 
     */
    getIcos() {
      return icos;
    }

  }

  return new ConfigFileStore();
}



export default ConfigFileService;




//





let idAttributes = {
  "__subcategory": {
    subcategory: "Telephone Number",
    type: "Static Data",
    category: "Global Attribute",
    defaultItemId: "___id",
    items: {
      "___id": {
        _id: "",
        value: "+995 551 949414",
        meta: {
          subcategory: "Telephone Number",
          type: "Static Data",
          category: "Global Attribute"
        }
      }
    }
  }
}

let a = {
  type: "Static Data",
  category: "Global Attribute",
  subcategory: "Telephone Number",

  defaultId: "___id",

  items: {
    "___id": {
      _id: "",
      value: "+995 551 949414"
    }
  }
}

let b = {
  type: "Static Data",
  category: "Global Attribute",
  subcategory: "Document",

  defaultId: "",

  items: {
    "___id": {
      _id: "",
      contentType: "",
      size: "",
      name: "",
      path: "+995 551 949414"
    }
  }
}