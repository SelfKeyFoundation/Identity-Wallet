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
          defer.reject(error);
        });
      } else {
        defer.reject({ message: 'electron not available' });
      }
      return defer.promise;
    }


    save() {
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

    load() {
      let defer = $q.defer();
      ElectronService.readDataStore().then((data) => {
        store = data;

        for (let i in store.idAttributes) {
          let idAttribute = new IdAttribute()
          idAttribute.setData(store.idAttributes[i]);
          store.idAttributes[i] = idAttribute;
        }

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

    getWalletPublicKeys() {
      return Object.keys(store.wallets);
    }

    getPublicKeys(type) {
      if(!type){
        return Object.keys(store.wallets);
      }else{
        let keys = [];
        for(let i in store.wallets){
          if(store.wallets[i].type === type){
            keys.push(i);
          }
        }
        return keys;
      }
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