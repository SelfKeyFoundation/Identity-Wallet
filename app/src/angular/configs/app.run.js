'use strict';

import $ from 'jquery';

import Wallet from '../classes/wallet';
import Token from '../classes/token';

function AppRun($rootScope, $log, $timeout, $interval, $state, $mdDialog, DICTIONARY, CONFIG, ElectronService, ConfigFileService, Web3Service) {
    'ngInject';

    $rootScope.selectedLanguage = "en";

    $log.debug('DICTIONARY', DICTIONARY);

    /**
     * 
     */
    $rootScope.INITIAL_ID_ATTRIBUTES = CONFIG.constants.initialIdAttributes;
    $rootScope.LOCAL_STORAGE_KEYS = CONFIG.constants.localStorageKeys;
    $rootScope.PRIMARY_TOKEN = CONFIG.constants.primaryToken;
    $rootScope.DICTIONARY = DICTIONARY[$rootScope.selectedLanguage];

    /**
     * 
     */
    $rootScope.ethUsdPrice = 795;
    $rootScope.keyUsdPrice = 0.015;

    /**
     * 
     */
    Wallet.$rootScope = $rootScope;
    Token.$rootScope = $rootScope;

    /**
     * 
     */
    $rootScope.getTranslation = function (prefix, keyword, args) {
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
        let store = ConfigFileService.getStore();
        if (store.setup.icoAdsShown) {
            $state.go('member.dashboard.main');
        } else {
            $state.go('member.setup.completed');
        }
    }

    $rootScope.closeApp = (event) => {
        ElectronService.closeApp();
    }

    $rootScope.openSendTokenDialog = (event, symbol) => {
        return $mdDialog.show({
            controller: 'SendTokenDialogController',
            templateUrl: 'common/dialogs/send-token.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            escapeToClose: false,
            locals: {
                args: {
                    symbol: symbol
                }
            }
        });
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
        let termsAccepted = store.setup ? store.setup.termsAccepted : false;
        if (!termsAccepted) {
            $timeout(() => {
                $mdDialog.show({
                    controller: 'TermsDialogController',
                    templateUrl: 'common/dialogs/terms.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    fullscreen: true,
                }).then(() => {
                    $mdDialog.show({
                        controller: 'StartupGuideDialogController',
                        templateUrl: 'common/dialogs/startup-guide.html',
                        parent: angular.element(document.body),
                        targetEvent: null,
                        clickOutsideToClose: false,
                        escapeToClose: false,
                        fullscreen: true,
                    })
                });
            }, 600);
        }
    };

    $rootScope.openAddCustomTokenDialog = (event) => {
        return $mdDialog.show({
            controller: 'AddCustomTokenDialogController',
            templateUrl: 'common/dialogs/add-custom-token.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true
        });
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

    ElectronService.analytics('app-start', new Date().toISOString());

    // test account
    //ElectronService.importEtherPrivateKey('0xf48194b05b5f927d392d6bd95da255f71ad486a6e5738c50fba472ad16b77fe1');

    window.Web3Service = Web3Service;
}

export default AppRun;