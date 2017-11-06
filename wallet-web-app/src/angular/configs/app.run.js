'use strict';

import $ from 'jquery';

function AppRun($rootScope, $log, $timeout, CONFIG, AnimationService, ElectronService, ConfigStorageService) {
    'ngInject';

    /**
     * 
     */
    $rootScope.LOCAL_STORAGE_KEYS = CONFIG.constants.localStorageKeys;

    /**
     * 
     */
    AnimationService.init();

    $rootScope.openUrlInNewWindow = function (url) {
        window.open(url)
    }

    $rootScope.test2 = function () {
        window.open("http://token.selfkey.org/");
    }

    $rootScope.test3 = function (event) {
        ElectronService.openUsersDocumentDirectoryChangeDialog(event);
    }

    $timeout(function(){
      $(".sparkley:first").sparkleh();
    }, 2000);

    /**
     * 
     */
    $rootScope.$on('local-storage:change', (event, data) => {
        $log.info('local-storage:change', data);
        if (ElectronService.ipcRenderer) {
            ElectronService.sendConfigChange(data);
        }
    });

}

export default AppRun;