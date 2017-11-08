'use strict';

function EtherscanService($rootScope, $window, $q, $timeout, $log, $http) {
  'ngInject';

  $log.info('EtherscanService Initialized');

  const SERVER_URL = "https://api.etherscan.io/api";
  const API_KEY = "4C1HD9C8VKIAEPWFK9DIS6ZUAQTBE7PMUD";

  /**
   * 
   */
  class EtherscanService { 
    constructor () {}

    getBalance (address) {
      let apiUrl = SERVER_URL + "?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + API_KEY
      return $http.get(apiUrl);
    }
  };

  return new EtherscanService();
}

export default EtherscanService;