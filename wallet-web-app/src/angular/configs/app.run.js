'use strict';

import $ from 'jquery';

function AppRun($rootScope, $log, $timeout, $interval, $state, DICTIONARY, CONFIG, ElectronService, ConfigStorageService, CommonService, WalletService) {
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
    $rootScope.INITIAL_ID_ATTRIBUTES = CONFIG.constants.initialIdAttributes;
    $rootScope.LOCAL_STORAGE_KEYS = CONFIG.constants.localStorageKeys;
    
    $rootScope.selectedLanguage = "en";



    /**
     * 
     */
    $rootScope.getTranslation = function (prefix, keyword, args) {
        if(prefix){
            keyword = prefix.toUpperCase() + "_" + keyword.toUpperCase();
        }
        
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

    $log.debug($rootScope.getTranslation(null, 'holaaa'), "???????");
    $log.debug($rootScope.getTranslation(null, "test_template", ['giorgio', '10']));

    /**
     * global functions
     */
    $rootScope.skipInitialIdAttributesSetup = (event) => {
        // TODO - mark setup.status as 'skipped'
        $state.go('member.dashboard.main');
    }

    $rootScope.closeApp = (event) => {
        ElectronService.closeApp();
    }

    $rootScope.openSendTokenDialog = (event, token) => {
        CommonService.showSendTokenDialog(token);
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

    $interval(() => {    
        if($rootScope.wallet && $rootScope.wallet.getAddress()){
          WalletService.loadBalance();
        }
    }, 10000);

    ElectronService.analytics('app-start', new Date().toISOString());
}

export default AppRun;