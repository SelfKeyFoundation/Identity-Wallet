'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const Token = requireAppModule('angular/classes/token');

function AppRun($rootScope, $log, $window, $timeout, $interval, $q, $state, $mdDialog, DICTIONARY, CONFIG, ElectronService, RPCService, SqlLiteService, Web3Service, CommonService) {
    'ngInject';

    $rootScope.isDevMode = CONFIG.dev;
    $rootScope.productName = appName;
    $rootScope.version = appVersion;
    $rootScope.selectedLanguage = CONFIG.defaultLanguage;

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
    $rootScope.PRICES = {};

    /**
     *
     */
    Wallet.$rootScope = $rootScope;
    Wallet.$interval = $interval;
    Wallet.$q = $q;
    Wallet.Web3Service = Web3Service;
    Wallet.SqlLiteService = SqlLiteService;
    Wallet.CommonService = CommonService;


    Token.$rootScope = $rootScope;
    Token.$q = $q;
    Token.$interval = $interval;
    Token.Web3Service = Web3Service;
    Token.SqlLiteService = SqlLiteService;
    Token.CommonService = CommonService;

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

    $rootScope.closeApp = (event) => {
        ElectronService.closeApp();
    }

    $rootScope.openInBrowser = function (url, useInAppBrowser) {
        useInAppBrowser ? $window.open(url) : ElectronService.openBrowserWindow(url);
    }

    $rootScope.openSendTokenDialog = (event, symbol, allowSelectERC20Token) => {
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
                    symbol: symbol,
                    allowSelectERC20Token : allowSelectERC20Token
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

    $rootScope.openInfoDialog = (event, text, title) => {
        $mdDialog.show({
            controller: 'InfoDialogController',
            templateUrl: 'common/dialogs/info-dialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            escapeToClose: false,
            locals: {
                text: text,
                title: title
            }
        });
    }

    $rootScope.checkTermsAndConditions = () => {
        let guideSettings = SqlLiteService.getGuideSettings();

        if (!guideSettings.termsAccepted) {
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
            }, 300);
        }
    };

    $rootScope.openUpdateDialog = (event, releaseName) => {
        return $mdDialog.show({
            controller: 'UpdateDialogController',
            templateUrl: 'common/dialogs/update.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                releaseName: releaseName
            }
        });
    };

    $rootScope.openAddEditDocumentDialog = (event, item, value, itAttributeType) => {
        return $mdDialog.show({
            controller: 'AddEditDocumentDialogController',
            templateUrl: 'common/dialogs/add-edit-document.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                item: item,
                value: value,
                idAttributeType: itAttributeType
            }
        });
    };

    $rootScope.openAddEditStaticDataDialog = (event, item, value, itAttributeType) => {
        return $mdDialog.show({
            controller: 'AddEditStaticDataDialogController',
            templateUrl: 'common/dialogs/add-edit-static-data.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                item: item,
                value: value,
                idAttributeType: itAttributeType
            }
        });
    };

    /**
     *
     */
    $rootScope.$on('local-storage:change', (event, data) => {
        $log.info('local-storage:change', data);
        if (RPCService.ipcRenderer) {
            ElectronService.sendConfigChange(data);
        }
    });
}

module.exports = AppRun;
