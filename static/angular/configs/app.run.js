'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const Token = requireAppModule('angular/classes/token');

function AppRun($rootScope, $log, $window, $timeout, $interval, $q, $state, $trace, $mdDialog, DICTIONARY, CONFIG, RPCService, SqlLiteService, Web3Service, CommonService, EtherScanService, LedgerService, SignService) {
    'ngInject';

    $trace.enable('TRANSITION');

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
    Wallet.EtherScanService = EtherScanService;

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
        RPCService.makeCall('closeApp', {});
    }

    $rootScope.openInBrowser = function (url, useInAppBrowser) {
        useInAppBrowser ? $window.open(url) : RPCService.makeCall('openBrowserWindow', { url: url });
    }

    $rootScope.openSendTokenDialog = (event, symbol, allowSelectERC20Token) => {
        $state.go('member.wallet.send-token', { symbol,  allowSelectERC20Token });
    };

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
    };

    $rootScope.openInfoDialog = (event, text, title) => {
        $mdDialog.show({
            controller: 'InfoDialogController',
            templateUrl: 'common/dialogs/info-dialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false,
            escapeToClose: false,
            locals: {
                text: text,
                title: title
            }
        });
    };

    $rootScope.openNewERC20TokenInfoDialog = (event, title, symbol, balance) => {
        $mdDialog.show({
            controller: 'NewERC20TokenInfoController',
            templateUrl: 'common/dialogs/new-erc20-token-info.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false,
            escapeToClose: false,
            locals: {
                symbol: symbol,
                title: title,
                balance: balance
            }
        });
    };

    $rootScope.openConfirmationDialog = (event, text, title) => {
        return $mdDialog.show({
            controller: 'ConfirmationDialogController',
            templateUrl: 'common/dialogs/confirmation-dialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false,
            escapeToClose: false,
            locals: {
                text: text,
                title: title
            }
        });
    };

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
                    });
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

    $rootScope.openAddEditDocumentDialog = (event, mode, idAttributeType, idAttribute) => {
        return $mdDialog.show({
            controller: 'AddEditDocumentDialogController',
            templateUrl: 'common/dialogs/id-attributes/add-edit-document.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                mode: mode,
                idAttributeType: idAttributeType,
                idAttribute: idAttribute
            }
        });
    };

    $rootScope.openAddEditStaticDataDialog = (event, mode, itAttributeType, idAttribute) => {
        return $mdDialog.show({
            controller: 'AddEditStaticDataDialogController',
            templateUrl: 'common/dialogs/id-attributes/add-edit-static-data.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                mode: mode,
                idAttributeType: itAttributeType,
                idAttribute: idAttribute
            }
        });
    };

    $rootScope.openDocumentPreviewDialog = (event, documentId) => {
        return $mdDialog.show({
            controller: 'DocumentPreviewDialogController',
            templateUrl: 'common/dialogs/document-preview.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                documentId: documentId
            }
        });
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
    };

    $rootScope.openConnectingToLedgerDialog = (event) => {
        return $mdDialog.show({
            controller: 'ConnectingToLedgerController',
            templateUrl: 'common/dialogs/connecting-to-ledger.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true
        });
    };

    $rootScope.openChooseLedgerAddressDialog = (accountsArr, ACCOUNTS_QUENTITY_PER_PAGE) => {
        return $mdDialog.show({
            controller: 'ChooseLedgerAddressController',
            templateUrl: 'common/dialogs/choose-ledger-address.html',
            parent: angular.element(document.body),
            targetEvent: null,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                baseAccounts: accountsArr,
                ACCOUNTS_QUENTITY_PER_PAGE: ACCOUNTS_QUENTITY_PER_PAGE
            }
        });
    };

    $rootScope.openConfirmLedgerTransactionWarningDialog = () => {
        let result = document.getElementsByClassName('send-token')[0];
        
        return $mdDialog.show({
            controller: 'ConfirmLedgerTransactionWarningController',
            templateUrl: 'common/dialogs/confirm-ledger-transaction-warning.html',
            parent: result ? angular.element(result) : angular.element(document.body),
            targetEvent: null,
            hasBackdrop: false,
            clickOutsideToClose: false,
            fullscreen: false
        });
    };

    $rootScope.broadcastKeyPress = (event) => {
        $rootScope.$broadcast('selfkey:on-keypress', event.key);
    }
}

module.exports = AppRun;
