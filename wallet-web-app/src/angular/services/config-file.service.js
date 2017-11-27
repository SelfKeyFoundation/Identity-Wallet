'use strict';

function ConfigFileService($rootScope, $log, $q, $timeout, CONFIG, ElectronService) {
  'ngInject';

  $log.debug('ConfigFileService Initialized');

  // publicKey : data
  let store = {
    settings: {
      userDataFolder: ""
    },
    wallets: {
      "0x5abb838bbb2e566c236f4be6f283541bf8866b68": {
        name: "Giorgi's Public key",
        keystoreFilePath: "",
        idAttributes: {
          documents: [],
          contacts: []
        }
      }
    }
  };

  let isReady = false;

  /**
   * Test Documents
   */
  function populateTemp() {
    store.wallets["0x5abb838bbb2e566c236f4be6f283541bf8866b68"] = {
      name: "Giorgi's Public key",
      idAttributes: {
        documents: [],
        contacts: []
      }
    }

    store
      .wallets["0x5abb838bbb2e566c236f4be6f283541bf8866b68"]
      .idAttributes
      .documents.push({
        id: generateId(),
        type: { id: 1, name: 'Passport' },
        name: 'US Passport',
        attestations: 1,
        privacy: 1,
        filePath: '5abb838bbb2e566c236f4be6f283541bf8866b68/documents/test-1.pdf',
        isDefault: 1
      });

    store
      .wallets["0x5abb838bbb2e566c236f4be6f283541bf8866b68"]
      .idAttributes
      .documents.push({
        id: generateId(),
        type: { id: 2, name: 'ID Card' },
        name: 'GE ID Card',
        attestations: 1,
        privacy: 1,
        filePath: '5abb838bbb2e566c236f4be6f283541bf8866b68/documents/test-1.pdf',
        isDefault: 0
      });

    /**
     * Test Contacts
     */
    store
      .wallets["0x5abb838bbb2e566c236f4be6f283541bf8866b68"]
      .idAttributes
      .contacts.push({
        id: generateId(),
        type: { id: 3, name: 'Phone' },
        value: '+58 441 334 92 67',
        status: 1,
        privacy: 1,
        isDefault: 1
      });
  }


  function generateId(m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) {
    return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
  }

  class ConfigFileStore {
    constructor() {
      this.generateId = generateId;
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

    /**
     * Important - Documet object structure is not defined yet.. 
     * we don't know it yet
     */

    addContact(contact) {
      if (contact._id) {
        let cont = this.findContactById(contact._id);
        cont.value = contact.value;
      } else {
        contact._id = this.generateId();
        store.idAttributes.contacts.push(contact);
      }
    }

    findContactsByType(type){
      console.log(type, store.idAttributes.contacts);
      let result = [];
      for (let i in store.idAttributes.contacts) {
        let item = store.idAttributes.contacts[i];
        if (item.type === type) {
          result.push(item);
        }
      }
      return result;
    }

    findContactById(id) {
      for (let i in store.idAttributes.contacts) {
        let item = store.idAttributes.contacts[i];
        if (item._id === id) {
          return item;
        }
      }
    }

    addDocument(document) {
      if (document._id) {
        let doc = this.findDocumentById(document._id);
        doc.filePath = document.filePath;
      } else {
        document._id = this.generateId();
        store.idAttributes.documents.push(document);
      }
    }

    findDocumentById(id) {
      for (let i in store.idAttributes.documents) {
        let doc = store.idAttributes.documents[i];
        if (doc._id === id) {
          return doc;
        }
      }
    }

    getDocumentsByType(type) {
      let result = [];
      for (let i in store.idAttributes.documents) {
        let doc = store.idAttributes.documents[i];
        if (doc.type === type) {
          result.push(doc);
        }
      }
      return result;
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
  }

  return new ConfigFileStore();
}

export default ConfigFileService;