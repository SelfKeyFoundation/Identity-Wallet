'use strict';

function ConfigStorageService($rootScope, $log, $q, CONFIG, localStorageService) {
  'ngInject';

  $log.debug('ConfigStorageService Initialized');

  // Temporary set selected private key
  // 0x5abb838bbb2e566c236f4be6f283541bf8866b68
  localStorageService.set(CONFIG.constants.localStorageKeys.SELECTED_PRIVATE_KEY, '0x5abb838bbb2e566c236f4be6f283541bf8866b68');

  let ConfigStorageService = function (data) {
    angular.extend(this, data);
  }

  /**
   * 
   */
  ConfigStorageService.prototype.setData = function (data) {
    angular.extend(this, data);
    $rootScope.$broadcast('local-storage:change', data);
  }

  /**
   * 
   */
  ConfigStorageService.prototype.load = () => {
    let defer = $q.defer();

    let data = {};
    data[CONFIG.constants.localStorageKeys.APP_OPEN_COUNT] = localStorageService.get(CONFIG.constants.localStorageKeys.APP_OPEN_COUNT);
    data[CONFIG.constants.localStorageKeys.USER_DOCUMENTS_STORAGE_PATH] = localStorageService.get(CONFIG.constants.localStorageKeys.USER_DOCUMENTS_STORAGE_PATH);
    data[CONFIG.constants.localStorageKeys.LEGAL_TERMS_AND_CONDITIONS] = localStorageService.get(CONFIG.constants.localStorageKeys.LEGAL_TERMS_AND_CONDITIONS);
    data[CONFIG.constants.localStorageKeys.SELECTED_PRIVATE_KEY] = localStorageService.get(CONFIG.constants.localStorageKeys.SELECTED_PRIVATE_KEY);

    ConfigStorageService.prototype.setData(data);

    defer.resolve(ConfigStorageService);

    return defer.promise;
  }

  /**
   * App open count
   */
  ConfigStorageService.prototype.setAppOpenCount = function (count) {
    localStorageService.set(CONFIG.constants.localStorageKeys.APP_OPEN_COUNT, count);
    return ConfigStorageService.prototype.load();
  }

  /**
   * User's documents storage path
   */
  ConfigStorageService.prototype.setUserDocumentsStoragePath = function (path) {
    localStorageService.set(CONFIG.constants.localStorageKeys.USER_DOCUMENTS_STORAGE_PATH, path);
    return ConfigStorageService.prototype.load();
  }

  /**
   * Legal terms and conditions agreed
   */
  ConfigStorageService.prototype.setLegalTermsAndConditionsAgreed = function (agreed) {
    localStorageService.set(CONFIG.constants.localStorageKeys.LEGAL_TERMS_AND_CONDITIONS, agreed);
    return ConfigStorageService.prototype.load();
  }

  /**
   * selected private key
   */
  ConfigStorageService.prototype.setSelectedPrivateKey = function (privateKey) {
    localStorageService.set(CONFIG.constants.localStorageKeys.SELECTED_PRIVATE_KEY, privateKey);
    return ConfigStorageService.prototype.load();
  }

  return new ConfigStorageService();
}

export default ConfigStorageService;