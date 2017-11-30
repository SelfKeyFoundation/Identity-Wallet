'use strict';

import $ from 'jquery';

function AppRun($rootScope, $log, $timeout, $state, DICTIONARY, CONFIG, ElectronService, ConfigStorageService) {
    'ngInject';

    $log.debug('DICTIONARY', DICTIONARY);

    /**
     * 
     */
    $rootScope.viewState = {
        
    }

    /**
     * 
     */
    $rootScope.LOCAL_STORAGE_KEYS = CONFIG.constants.localStorageKeys;

    $rootScope.selectedLanguage = "en";

    /**
     * 
     */
    $rootScope.getTranslation = function (keyword, args) {
        let template = DICTIONARY[$rootScope.selectedLanguage][keyword] || 'translation not found';
        if (args) {
            for (let i = 0; i < args.length; i++) {
                template = template.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
            }
        }
        return template;
    }

    $rootScope.buildErrorObject = (keyword, error) => {
        return {
            message: $rootScope.getTranslation(keyword),
            causedBy: error
        }
    }

    $log.debug($rootScope.getTranslation('holaaa'), "???????");
    $log.debug($rootScope.getTranslation("test_template", ['giorgio', '10']));

    /**
     * global functions
     */
    $rootScope.skipInitialIdAttributesSetup = (event) => {
        // TODO - mark setup.status as 'skipped'
        $state.go('member.dashboard.main');
    }

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