'use strict';

function ConfigStorageService($rootScope, $log, CONFIG, localStorageService) {
  'ngInject';

  $log.debug('ConfigStorageService Initialized');


  let ConfigStorageService = function () {
    /**
     * App open count
     */
    this.getAppOpenCount = function () {
      return localStorageService.get(CONFIG.constants.localStorageKeys.APP_OPEN_COUNT);
    }
    this.setAppOpenCount = function (count) {
      localStorageService.set(CONFIG.constants.localStorageKeys.APP_OPEN_COUNT, count);
    }

    /**
     * User's documents storage path
     */
    this.getUserDocumentsStoragePath = function () {
      return localStorageService.get(CONFIG.constants.localStorageKeys.USER_DOCUMENTS_STORAGE_PATH);
    }
    this.setUserDocumentsStoragePath = function (path) {
      localStorageService.set(CONFIG.constants.localStorageKeys.USER_DOCUMENTS_STORAGE_PATH, path);
    }

    /**
     * Legal terms and conditions agreed
     */
    this.getLegalTermsAndConditionsAgreed = function () {
      return localStorageService.get(CONFIG.constants.localStorageKeys.LEGAL_TERMS_AND_CONDITIONS);
    }
    this.setLegalTermsAndConditionsAgreed = function (agreed) {
      localStorageService.set(CONFIG.constants.localStorageKeys.LEGAL_TERMS_AND_CONDITIONS, agreed);
    }
  }

  return new ConfigStorageService();
}

export default ConfigStorageService;