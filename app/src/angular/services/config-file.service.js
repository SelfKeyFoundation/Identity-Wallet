'use strict';
import * as async from "async";
import IdAttributeType from '../classes/id-attribute-type.js';
import Ico from '../classes/ico.js';
import ActionLogItem from '../classes/action-log-item.js';
import IdAttribute from '../classes/id-attribute';

// Actually Local Storage Service
function ConfigFileService($rootScope, $log, $q, $timeout, CONFIG, ElectronService, CommonService) {
  'ngInject';

  $log.debug('ConfigFileService Initialized');

  let isReady = false;

  // main store
  let store = null;

  // temporary stored datas
  let idAttributeTypes = {};
  let icos = {};

  class ConfigFileStore {

    constructor() {
      ActionLogItem.ConfigFileService = this;

      this.q = async.queue((data, callback) => {
        let newStore = JSON.parse(data.store);

        ElectronService.saveDataStore(newStore).then(() => {
          callback(null, newStore);
        }).catch((err) => {
          callback(err);
        });
      }, 1);
    }

    init() {
      const me = this;

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


    saveStore() {
      const me = this;
      const defer = $q.defer();
      const jsonConfig = JSON.stringify(store);
      me.q.push({ store: jsonConfig }, (err, conf) => {
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(conf);
      });
      
      return defer.promise;
    }

    save() {
      return ElectronService.saveDataStore(store);
    }

    load() {
      let defer = $q.defer();
      ElectronService.readDataStore().then((data) => {
        store = data;

        for (let i in store.idAttributes) {
          let idAttribute = new IdAttribute()
          idAttribute.setData(store.idAttributes[i]);
          store.idAttributes[i] = idAttribute;
        }

        console.log(">>>>> STORE LOADED >>>>", store);

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

    findIdAttributeItemByKeyAndAdditions(key, additions) {
      if (!store.idAttributes[key]) { return null; }

      let result = [];

      let idAttribute = store.idAttributes[key];
      let items = idAttribute.items;

      for (let i in items) {
        let shouldAdd = true;
        let item = items[i];

        for (let j in additions) {
          if (!item.addition[j] || item.addition[j] !== additions[j]) {
            shouldAdd = false;
            break;
          }
        }

        if (shouldAdd) {
          result.push(item);
        }
      }

      return result;
    }

    findIdAttributeItemByKeyAndId(key, id) {
      if (!store.idAttributes[key] || !store.idAttributes[key].items[id]) { return null; }
      return store.idAttributes[key].items[id];
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

    getIdAttributeType(key) {
      return idAttributeTypes[key];
    }

    setIdAttributeTypes(data) {
      idAttributeTypes = data;
    }

    /**
     * 
     */
    getIcos() {
      return icos;
    }

    addIco(status, ico) {
      if (!icos[status]) {
        icos[status] = [];
      }
      icos[status].push(ico);
    }

  }

  return new ConfigFileStore();
}

export default ConfigFileService;