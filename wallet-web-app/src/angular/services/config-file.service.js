'use strict';
import IdAttributeType from '../classes/id-attribute-type.js';
import Ico from '../classes/ico.js';

function ConfigFileService($rootScope, $log, $q, $timeout, CONFIG, ElectronService, CommonService) {
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

    }

    init() {
      let defer = $q.defer();

      if (ElectronService.ipcRenderer) {
        ElectronService.initDataStore().then((data) => {
          store = data;

          // TODO
          // 1: Load id attribute types from airtable
          // 2: Load ICOs

          // 1: create Temporary data
          idAttributeTypes['Name'] = new IdAttributeType('Name', 'Global Attribute', 'Static Data', ['individual']);
          idAttributeTypes['Email'] =  new IdAttributeType('Email', 'Global', 'Static', ['individual']);
          idAttributeTypes['Telephone Number'] = new IdAttributeType('Telephone Number', 'Global', 'Static', ['company', 'individual'])
          idAttributeTypes['Passport'] = new IdAttributeType('Passport', 'Identity Document', 'Document', ['individual'])
          idAttributeTypes['National ID Card'] = new IdAttributeType('National ID Card', 'Identity Document', 'Document', ['individual']);
          idAttributeTypes['Utility Bill'] = new IdAttributeType('Utility Bill', 'Proof of Address', 'Document', ['individual']);

          // 2: load temporary icos
          loadTempIcos ();

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

    addIdAttribute(idAttribute) {
      store.idAttributes[idAttribute.subcategory] = idAttribute;
    }

    addItemToIdAttribute (subcategory, item) {
      if(store.idAttributes[subcategory]){
        item._id = CommonService.generateId();
        store.idAttributes[subcategory][item._id] = item;
      }else{
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
    getIdAttributeTypes () {
      return idAttributeTypes;
    }

    getIdAttributeType (type) {
      return idAttributeTypes[type];
    }

    /**
     * 
     */
    getIcos () {
      return icos;
    }

  }

  function loadTempIcos () {
    let ico1 = new Ico();
    ico1.companyName = 'GATCOIN';
    ico1.status = 'active';
    ico1.teamLoaction = 'Hong Kong';
    ico1.video = 'https://www.youtube.com/watch?v=qq0_WVK8lMc';
    ico1.shortDescription = 'GATCOIN is an eCommerce platform which...';
    ico1.description = 'GATCOIN is an eCommerce platform which...';
    ico1.category = 'Retail';
    ico1.startDate = '15 Dec 2017';
    ico1.endDate = '15 Jan 2018';
    ico1.capital.total = '$35,870,370';
    ico1.capital.raised = '$1,000,000';
    ico1.capital.goal = '$35,870,370';
    ico1.ticker = 'GAT';
    ico1.token.total = '??';
    ico1.token.totalForSale = '1,000,000,000';
    ico1.token.price = '1 GAT = 0.20 USD';
    ico1.token.issue = 'Ongoing';
    ico1.preSale.sold = '1,000,000 USD';
    ico1.preSale.bonus = '1 GAT = 0.167 USD';
    ico1.whitelist = 'YES';
    ico1.kyc.required = 'YES';
    ico1.kyc.template = '';
    ico1.accepts = ['BTC', 'ETH'];
    ico1.restrictions.other = 'NA';
    ico1.whitepaper = 'https://www.gatcoin.io/wp-content/uploads/2017/09/170919v2-Whitepaper-EN.pdf';
    ico1.website = 'https://www.gatcoin.io/';
  
    let ico3 = new Ico();
    ico3.companyName = 'Aditus Network';
    ico3.status = 'active';
    ico3.teamLoaction = 'Singapore';
    ico3.video = 'https://medium.com/aditusnetwork/forbes-cites-aditus-as-key-blockchain-player-9bb51481ac5b';
    ico3.shortDescription = 'Aditus is an eCommerce platform which...';
    ico3.description = 'Aditus is an eCommerce platform which...';
    ico3.category = 'Luxury';
    ico3.startDate = '30 Nov 2017';
    ico3.endDate = '13 December 2017';
    ico3.capital.total = '$11,000,000';
    ico3.capital.raised = '$4717639';
    ico3.capital.goal = '$11,000,000';
    ico3.ticker = 'ADI';
    ico3.token.total = '450,000,000';
    ico3.token.totalForSale = '1,000,000,000';
    ico3.token.price = '1 ADI = 0.05 USD';
    ico3.token.issue = '';
    ico3.preSale.sold = '4,717,639 USD';
    ico3.preSale.bonus = '3% until 6 December 2017 6pm SGT, 2% until 13 December 2017 10pm SGT';
    ico3.whitelist = 'YES';
    ico3.kyc.required = 'YES';
    ico3.kyc.template = '';
    ico3.accepts = ['BTC', 'ETH'];
    ico3.restrictions.other = 'US Citizens, Chinese Citizens';
    ico3.whitepaper = 'https://www.aditus.net/';
    ico3.website = 'https://www.gatcoin.io/';
  
  
    let ico4 = new Ico();
    ico4.companyName = 'AiX';
    ico4.status = 'upcoming';
    ico4.teamLoaction = 'London';
    ico4.video = 'https://aix.trade/wp-content/uploads/2017/11/AiX-Trading.-Transformed.mp4';
    ico4.shortDescription = 'AiX is an eCommerce platform which...';
    ico4.description = 'AiX is an eCommerce platform which...';
    ico4.category = 'Finance';
    ico4.startDate = 'TBA';
    ico4.endDate = 'TBA';
    ico4.capital.total = 'TBA';
    ico4.capital.raised = 'TBA';
    ico4.capital.goal = 'TBA';
    ico4.ticker = 'AIX';
    ico4.token.total = 'TBA';
    ico4.token.totalForSale = 'TBA';
    ico4.token.price = 'TBA';
    ico4.token.issue = 'TBA';
    ico4.preSale.sold = 'TBA';
    ico4.preSale.bonus = 'TBA';
    ico4.whitelist = 'YES';
    ico4.kyc.required = 'YES';
    ico4.kyc.template = '';
    ico4.accepts = ['TBA'];
    ico4.restrictions.other = 'TBA';
    ico4.whitepaper = 'https://aix.trade/ai-x_whitepaper.pdf';
    ico4.website = 'https://aix.trade/';
  
  
    icos.active.push(ico1);
    icos.active.push(ico3);
    icos.upcoming.push(ico4);

    $rootScope.icos = icos;
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