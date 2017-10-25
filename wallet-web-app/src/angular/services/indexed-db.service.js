'use strict';

function IndexedDBService($rootScope, $log, $q, CONFIG, localStorageService) {
  'ngInject';

  $log.debug('IndexedDBService Initialized');

  const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  const PRIVATE_KEYS_STORE = "PrivateKeysStore";
  const CONTACT_INFOS_STORE = "ContactInfosStore";
  const DOCUMENTS_STORE = "DocumentsStore";

  const database = indexedDB.open(CONFIG.APP_NAME, 1);
  let connection;

  // Create the schema
  database.onupgradeneeded = function () {
    let db = database.result;

    /**
     * Create store
     */
    let privateKeysStore = db.createObjectStore(PRIVATE_KEYS_STORE, { keyPath: "privateKey" });
    let contactInfosStore = db.createObjectStore(CONTACT_INFOS_STORE, { keyPath: "privateKey" });
    let documentsStore = db.createObjectStore(DOCUMENTS_STORE, { keyPath: "privateKey" });

    /**
     * create test data
     */
    privateKeysStore.put({ privateKey: "0x5abb838bbb2e566c236f4be6f283541bf8866b68", name: "Test Key 1" });
    privateKeysStore.put({ privateKey: "0xd357905d32a29bc346df7d74962f2a5100053d61", name: "Test Key 2" });

    contactInfosStore.put({
      privateKey: "0x5abb838bbb2e566c236f4be6f283541bf8866b68", data: [
        { id: generateId(), type: 'Phone', value: '+58 441 334 92 67', status: 1, privacy: 1, isDefault: 1 },
        { id: generateId(), type: 'Email', value: 'cbruguera@gmail.com', status: 1, privacy: 0, isDefault: 1 }
      ]
    });

    documentsStore.put({
      privateKey: "0x5abb838bbb2e566c236f4be6f283541bf8866b68", data: [
        { id: generateId(), type: 'Passport', name: 'US Passport', attestations: 1, privacy: 1, filePath: '/Users/giorgio/workspace/assets/VamekhBasharuliCV.pdf', isDefault: 1 },
        { id: generateId(), type: 'Passport', name: 'Passatore Venezolano', attestations: 0, privacy: 1, filePath: '/Users/giorgio/workspace/assets/VamekhBasharuliCV.pdf', isDefault: 0 },
        { id: generateId(), type: 'Passport', name: 'Cedula De Identidad', attestations: 1, privacy: 0, filePath: '/Users/giorgio/workspace/assets/VamekhBasharuliCV.pdf', isDefault: 0 }
      ]
    });

    /**
     * Create index
     */
    //var index = store1.createIndex("NameIndex", ["name.last", "name.first"]);

  };

  database.onsuccess = () => {
    // save open connection
    connection = database.result;

    $rootScope.$broadcast('indexed-db:ready');

    // Start a new transaction
    //let tx = connection.transaction("PrivateKeysStore", "readwrite");
    //let privateKeysStore = tx.objectStore("PrivateKeysStore");
  }


  let IndexedDBService = (data) => {
    angular.extend(this, data);
  }

  /**
   * 
   */
  IndexedDBService.prototype.setData = (data) => {
    angular.extend(this, data);
  }

  IndexedDBService.prototype.getStore = getStore;

  IndexedDBService.prototype.closeConnection = () => {
    connection.close();
  }

  /**
   * Private Key 
   */
  IndexedDBService.prototype.privateKey_getAll = () => {
    return getAll(PRIVATE_KEYS_STORE);
  }

  IndexedDBService.prototype.privateKey_get = (key) => {
    return getByKey(PRIVATE_KEYS_STORE, key);
  }

  /**
   * Contact Info
   */
  IndexedDBService.prototype.contactInfos_get = (key) => {
    return getByKey(CONTACT_INFOS_STORE, key);
  }

  IndexedDBService.prototype.contactInfos_save = (record) => {
    return put(CONTACT_INFOS_STORE, record);
  }

  /**
   * Documents
   */
  IndexedDBService.prototype.documents_get = (key) => {
    return getByKey(DOCUMENTS_STORE, key);
  }

  IndexedDBService.prototype.documents_save = (record) => {
    return put(DOCUMENTS_STORE, record);
  }

  /**
   * Helper
   */
  IndexedDBService.prototype.generateId = generateId;

  /**
   * 
   */
  function getStore(storeName) {
    let tx = connection.transaction(storeName, "readwrite");
    return { tx: tx, store: tx.objectStore(storeName) };
  }

  function getByKey(STORE, KEY) {
    let defer = $q.defer();

    try {
      let db = getStore(STORE);
      let res = db.store.get(KEY);
      console.log(db.store, "<<<<<<<<<<<")
      res.onsuccess = () => {
        defer.resolve(res.result);
      };

      res.onerror = (error) => {
        defer.reject(error);
      }
    } catch (e) {
      defer.reject(e);
    }

    return defer.promise;
  }

  function getAll(STORE) {
    let defer = $q.defer();

    try {
      let db = getStore(STORE);

      let res = db.store.getAll();

      res.onsuccess = () => {
        defer.resolve(res.result);
      };

      res.onerror = (error) => {
        defer.reject(error);
      }
    } catch (e) {
      defer.reject(e);
    }

    return defer.promise;
  }

  function put(STORE, RECORD) {
    let defer = $q.defer();

    try {
      let db = getStore(STORE);

      let res = db.store.put(RECORD);

      res.onsuccess = () => {
        defer.resolve(res.result);
      };

      res.onerror = (error) => {
        defer.reject(error);
      }
    } catch (e) {
      defer.reject(e);
    }

    return defer.promise;
  }

  function generateId(m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) {
    return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
  }

  return new IndexedDBService();
}

export default IndexedDBService;