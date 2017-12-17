'use strict';

function SelfkeyService($rootScope, $window, $q, $timeout, $log, $http, $httpParamSerializerJQLike, EVENTS, ElectronService, CommonService, $interval) {
  'ngInject';

  $log.info('SelfkeyService Initialized');

  /**
   * 
   */
  const API_URL = 'https://alpha.selfkey.org/marketplace/i/api/digital-assets';

  
  /**
   * 
   */
  class SelfkeyService {

    constructor() {
      
    }

    //
    getUpcomingIcos () {
      let promise = $http.get('https://alpha.selfkey.org/marketplace/i/api/digital-assets');
      promise.then((response)=>{
        // TODO handle response.?????
        /*
        Assets: [],
        Old_exchanges: [],
        Exchanges: [],
        Wallets: [],
        Bitcoin_debit_cards: [],
        Assets_2: [],
        ICOs_Research: [],
        Sales: []
        */
      }).catch((error)=>{
        // TODO handle
      });
    }

  };

  return new SelfkeyService();
}

export default SelfkeyService;