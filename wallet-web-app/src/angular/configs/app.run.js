'use strict';

import $ from 'jquery';

function AppRun($rootScope, $log, $timeout, $interval, $state, $mdDialog, DICTIONARY, CONFIG, ElectronService, ConfigFileService, ConfigStorageService, CommonService, WalletService) {
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
    $rootScope.ethUsdPrice = 795;
    $rootScope.keyUsdPrice = 0.015;

    /**
     * 
     */
    $rootScope.getTranslation = function (prefix, keyword, args) {
        return keyword;
        
        if (prefix) {
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

    $rootScope.openReceiveTokenDialog = (event, args) => {
        return $mdDialog.show({
            controller: 'ReceiveTokenDialogController',
            templateUrl: 'common/dialogs/receive-token.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                args: args
            }
        });
    }

    $rootScope.checkTermsAndConditions = () => {
        let store = ConfigFileService.getStore();
        if (!store.setup.termsAccepted) {
            $timeout(() => {
                $mdDialog.show({
                    controller: 'TermsDialogController',
                    templateUrl: 'common/dialogs/terms.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: false,
                    fullscreen: true,
                }).then(()=>{
                    $mdDialog.show({
                        controller: 'StartupGuideDialogController',
                        templateUrl: 'common/dialogs/startup-guide.html',
                        parent: angular.element(document.body),
                        targetEvent: null,
                        clickOutsideToClose: false,
                        fullscreen: true,
                    })
                });
            }, 600);
        }
    };

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
        if ($rootScope.wallet && $rootScope.wallet.getAddress()) {
            WalletService.loadBalance();
        }
    }, 10000);

    ElectronService.analytics('app-start', new Date().toISOString());
}

export default AppRun;