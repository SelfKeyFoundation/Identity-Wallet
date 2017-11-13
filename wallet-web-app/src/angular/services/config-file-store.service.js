'use strict';

function ConfigFileStoreService($rootScope, $log, $q, CONFIG, ElectronService) {
  'ngInject';

  $log.debug('ConfigFileStoreService Initialized');

  const PRIVATE_KEYS_STORE = "PrivateKeysStore";
  const CONTACT_INFOS_STORE = "ContactInfosStore";
  const DOCUMENTS_STORE = "DocumentsStore";

  // 1 Load file if exists
  //   or create default config
  const defaultConfig = {
    PrivateKeysStore: {
      "0x5abb838bbb2e566c236f4be6f283541bf8866b68": { name: "Test Key 1" },
      "0xd357905d32a29bc346df7d74962f2a5100053d61": { name: "Test Key 2" }
    },
    ContactInfosStore: {
      "0x5abb838bbb2e566c236f4be6f283541bf8866b68": [
          { id: generateId(), type: 'Phone', value: '+58 441 334 92 67', status: 1, privacy: 1, isDefault: 1 },
          { id: generateId(), type: 'Email', value: 'cbruguera@gmail.com', status: 1, privacy: 0, isDefault: 1 }
        ]
    },
    DocumentsStore: {
      "0x5abb838bbb2e566c236f4be6f283541bf8866b68": [
        { id: generateId(), type: 'Passport', name: 'US Passport', attestations: 1, privacy: 1, filePath: '/Users/giorgio/workspace/assets/VamekhBasharuliCV.pdf', isDefault: 1 },
        { id: generateId(), type: 'Passport', name: 'Passatore Venezolano', attestations: 0, privacy: 1, filePath: '/Users/giorgio/workspace/assets/VamekhBasharuliCV.pdf', isDefault: 0 },
        { id: generateId(), type: 'Passport', name: 'Cedula De Identidad', attestations: 1, privacy: 0, filePath: '/Users/giorgio/workspace/assets/VamekhBasharuliCV.pdf', isDefault: 0 }
      ]
    }
  };

  let memoryStore = defaultConfig;
  let loading = true;

  if (ElectronService) {
    ElectronService.readConfig().then((data) => {
      loading = false;
      console.log("Loading config file", data);
      if (Object.keys(data).length !== 0)
        memoryStore = data;
    }).catch((error) => console.error(error) );
  }
  
  

  function generateId(m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) {
    return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
  }

  class ConfigFileStore {
    constructor ($log) {
      this.generateId = generateId;
    }

    contactInfos_get (privateKey) {
      return new Promise((resolve, reject) => {
        if (loading) {
          setTimeout(_ => {
            const data = memoryStore[CONTACT_INFOS_STORE][privateKey];
            if (data) {
              resolve(data);
            }
            else {
              reject('Not found');
            }
          }, 500);
        } 
        else {
          const data = memoryStore[CONTACT_INFOS_STORE][privateKey];
          if (data) {
            resolve(data);
          }
          else {
            reject('Not found');
          }
        }
      });
    }

    contactInfos_save (privateKey, data) {
      return new Promise((resolve, reject) => {
        const key = memoryStore[CONTACT_INFOS_STORE][privateKey];

        if (key) {
          memoryStore[CONTACT_INFOS_STORE][privateKey] = data;
          ElectronService.saveConfig(memoryStore).then((data) => {
            console.log("saved config file", data);
          });
          resolve(memoryStore[CONTACT_INFOS_STORE][privateKey]);
        }
        else {
          reject('Not found');
        }
      });
    }

    documents_get (privateKey) {
      return new Promise((resolve, reject) => {
        const data = memoryStore[DOCUMENTS_STORE][privateKey];
        if (data) {
          resolve(data);
        }
        else {
          reject('Not found');
        }
      });
    }

    documents_save (privateKey, data) {
      return new Promise((resolve, reject) => {
        const key = memoryStore[DOCUMENTS_STORE][privateKey];

        if (key) {
          memoryStore[DOCUMENTS_STORE][privateKey] = data;
          ElectronService.saveConfig(memoryStore).then((data) => {
            console.log("saved config file", data);
          });
          resolve(memoryStore[DOCUMENTS_STORE][privateKey]);
        }
        else {
          reject('Not found');
        }
      });
    }
    
  }

  return new ConfigFileStore($log);
}

export default ConfigFileStoreService;