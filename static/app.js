'use strict';

document.addEventListener('dragover', function (event) {
  event.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function (event) {
  event.preventDefault();
  return false;
}, false);

/**
 *
 */
window.zxcvbn = require('./node_modules/zxcvbn');
window.qrcode = require('qrcode-generator');

/**
 * External Modules
 */
require('@uirouter/angularjs');
require('angular-material');
require('angular-messages');
require('angular-sanitize');
require('angular-local-storage');
require('angular-qrcode');
require('angular-zxcvbn');

/**
 *
 */
require('./angular/app.templates');

/**
 * main module: 'kyc-wallet'
 */
window.app = angular.module('kyc-wallet', [
  'ngMaterial',
  'ngMessages',
  'ngSanitize',
  'ui.router',
  'templates',
  'LocalStorageModule',
  'monospaced.qrcode',
  'zxcvbn'
]);

/**
 * Internal Modules
 */
const appRun = require('angular/configs/app.run');
const appStates = require('./angular/configs/app.states');

/**
 * constants
 */
const config = require('./config', true);
let envConfig = isDevMode() ? config.default : config.production;
let appConfig = Object.assign(config.common, envConfig);

angular.module('kyc-wallet').constant('CONFIG', appConfig);

const appDictionaryConstant = require('./angular/constants/app.dictionary.constant');
angular.module('kyc-wallet').constant('DICTIONARY', appDictionaryConstant);

const appEventsConstant = require('./angular/constants/app.events.constant');
angular.module('kyc-wallet').constant('EVENTS', appEventsConstant);


/**
 * services
 */
const RPCService = require('./angular/services/rpc.service');
angular.module('kyc-wallet').service('RPCService', RPCService);

const SqlLiteService = require('./angular/services/sql-lite.service');
angular.module('kyc-wallet').service('SqlLiteService', SqlLiteService);

const CommonService = require('./angular/services/common.service');
angular.module('kyc-wallet').service('CommonService', CommonService);

const EtherScanService = require('./angular/services/ether-scan.service');
angular.module('kyc-wallet').service('EtherScanService', EtherScanService);

const Web3Service = require('./angular/services/web3.service');
angular.module('kyc-wallet').service('Web3Service', Web3Service);

const EtherUnitsService = require('./angular/services/ether-units.service');
angular.module('kyc-wallet').service('EtherUnitsService', EtherUnitsService);

const SelfkeyService = require('./angular/services/selfkey.service');
angular.module('kyc-wallet').service('SelfkeyService', SelfkeyService);

const LedgerService = require('./angular/services/ledger.service');
angular.module('kyc-wallet').service('LedgerService', LedgerService);

const SignService = require('./angular/services/sign.service');
angular.module('kyc-wallet').service('SignService', SignService);


/**
 * directives
 */
const SkCloseWarningBoxDirective = require('./angular/directives/commons/sk-close-warning-box.directive');
angular.module('kyc-wallet').directive('skCloseWarningBox', SkCloseWarningBoxDirective);

const SkOfflineWarningBoxDirective = require('./angular/directives/commons/sk-offline-warning-box.directive');
angular.module('kyc-wallet').directive('skOfflineWarningBox', SkOfflineWarningBoxDirective);

const SkLoadingDirective = require('./angular/directives/commons/sk-loading.directive');
angular.module('kyc-wallet').directive('skLoading', SkLoadingDirective);

const SkIconDirective = require('./angular/directives/commons/sk-icon.directive');
angular.module('kyc-wallet').directive('skIcon', SkIconDirective);

const SkButtonLoadingDirective = require('./angular/directives/commons/sk-button-loading.directive');
angular.module('kyc-wallet').directive('skButtonLoading', SkButtonLoadingDirective);

const SkSelectIfDirective = require('./angular/directives/commons/sk-select-if.directive');
angular.module('kyc-wallet').directive('skSelectIf', SkSelectIfDirective);

const skShowLoading = require('./angular/directives/commons/sk-show-loading.directive');
angular.module('kyc-wallet').directive('skShowLoading', skShowLoading);

const SkLinearProgressDirective = require('./angular/directives/commons/sk-linear-progress.directive');
angular.module('kyc-wallet').directive('skLinearProgress', SkLinearProgressDirective);

const SkTokenBoxDirective = require('./angular/directives/commons/sk-token-box.directive');
angular.module('kyc-wallet').directive('skTokenBox', SkTokenBoxDirective);

const SkCustomTokenBoxDirective = require('./angular/directives/commons/sk-custom-token-box.directive');
angular.module('kyc-wallet').directive('skCustomTokenBox', SkCustomTokenBoxDirective);

const SkCirclePieChartDirective = require('./angular/directives/commons/sk-circle-pie-chart.directive');
angular.module('kyc-wallet').directive('skCirclePieChart', SkCirclePieChartDirective);

const SkUserInfoBoxDirective = require('./angular/directives/commons/sk-user-info-box.directive');
angular.module('kyc-wallet').directive('skUserInfoBox', SkUserInfoBoxDirective);

const ScrollToEndDirective = require('./angular/directives/commons/scroll-to-end.directive');
angular.module('kyc-wallet').directive('scrollToEnd', ScrollToEndDirective);

const CopyToClipboardDirective = require('./angular/directives/commons/copy-to-clipboard.directive');
angular.module('kyc-wallet').directive('copyToClipboard', CopyToClipboardDirective);

const SkDoubleHeaderDirective = require('./angular/directives/commons/sk-double-header.directive');
angular.module('kyc-wallet').directive('skDoubleHeader', SkDoubleHeaderDirective);

/**
 * controllers
 */

/**
 * commons
 */
const ToastController = require('./angular/controllers/commons/toast-controller.js');
angular.module('kyc-wallet').controller('ToastController', ToastController);

const TermsDialogController = require('./angular/controllers/commons/dialogs/terms-controller.js');
angular.module('kyc-wallet').controller('TermsDialogController', TermsDialogController);

const StartupGuideDialogController = require('./angular/controllers/commons/dialogs/startup-guide-controller.js');
angular.module('kyc-wallet').controller('StartupGuideDialogController', StartupGuideDialogController);

const ReceiveTokenDialogController = require('./angular/controllers/commons/dialogs/receive-token-controller.js');
angular.module('kyc-wallet').controller('ReceiveTokenDialogController', ReceiveTokenDialogController);

const SendTokenDialogController = require('./angular/controllers/commons/dialogs/send-token-controller.js');
angular.module('kyc-wallet').controller('SendTokenDialogController', SendTokenDialogController);

const UpdateDialogController = require('./angular/controllers/commons/dialogs/update-controller.js');
angular.module('kyc-wallet').controller('UpdateDialogController', UpdateDialogController);

const PasswordWarningDialogController = require('./angular/controllers/commons/dialogs/password-warning-controller.js');
angular.module('kyc-wallet').controller('PasswordWarningDialogController', PasswordWarningDialogController);

const IdWalletInfoController = require('./angular/controllers/commons/dialogs/id-wallet-info-controller.js');
angular.module('kyc-wallet').controller('IdWalletInfoController', IdWalletInfoController);

const InfoDialogController = require('./angular/controllers/commons/dialogs/info-dialog-controller.js');
angular.module('kyc-wallet').controller('InfoDialogController', InfoDialogController);

const ConnectingToLedgerController = require('./angular/controllers/commons/dialogs/connecting-to-ledger-controller.js');
angular.module('kyc-wallet').controller('ConnectingToLedgerController', ConnectingToLedgerController);

const ChooseLedgerAddressController = require('./angular/controllers/commons/dialogs/choose-ledger-address-controller.js');
angular.module('kyc-wallet').controller('ChooseLedgerAddressController', ChooseLedgerAddressController);

const ConfirmLedgerTransactionWarningController = require('./angular/controllers/commons/dialogs/confirm-ledger-transaction-warning-controller.js');
angular.module('kyc-wallet').controller('ConfirmLedgerTransactionWarningController', ConfirmLedgerTransactionWarningController);

const AddEditDocumentDialogController = require('./angular/controllers/commons/dialogs/id-attributes/add-edit-document-controller.js');
angular.module('kyc-wallet').controller('AddEditDocumentDialogController', AddEditDocumentDialogController);

const AddEditStaticDataDialogController = require('./angular/controllers/commons/dialogs/id-attributes/add-edit-static-data-controller.js');
angular.module('kyc-wallet').controller('AddEditStaticDataDialogController', AddEditStaticDataDialogController);

const AddIdAttributeDialogController = require('./angular/controllers/commons/dialogs/id-attributes/add-id-attribute-controller.js');
angular.module('kyc-wallet').controller('AddIdAttributeDialogController', AddIdAttributeDialogController);

const AddCustomTokenDialogController = require('./angular/controllers/commons/dialogs/add-custom-token-controller.js');
angular.module('kyc-wallet').controller('AddCustomTokenDialogController', AddCustomTokenDialogController);

const NewERC20TokenInfoController = require('./angular/controllers/commons/dialogs/new-erc20-token-info-controller.js');
angular.module('kyc-wallet').controller('NewERC20TokenInfoController', NewERC20TokenInfoController);

const ConfirmationDialogController = require('./angular/controllers/commons/dialogs/confirmation-dialog-controller.js');
angular.module('kyc-wallet').controller('ConfirmationDialogController', ConfirmationDialogController);


/**
 * guest
 */
const GuestLayoutController = require('./angular/controllers/guest/layout-controller.js');
angular.module('kyc-wallet').controller('GuestLayoutController', GuestLayoutController);

const GuestLoadingController = require('./angular/controllers/guest/loading-controller.js');
angular.module('kyc-wallet').controller('GuestLoadingController', GuestLoadingController);

/**
 * const wallet
 */
const GuestImportWalletController = require('./angular/controllers/guest/import/import-controller.js');
angular.module('kyc-wallet').controller('GuestImportWalletController', GuestImportWalletController);

const GuestImportKeystoreController = require('./angular/controllers/guest/import/keystore-controller.js');
angular.module('kyc-wallet').controller('GuestImportKeystoreController', GuestImportKeystoreController);

const GuestImportPrivateKeyController = require('./angular/controllers/guest/import/private-key-controller.js');
angular.module('kyc-wallet').controller('GuestImportPrivateKeyController', GuestImportPrivateKeyController);

const GuestImportLedgerController = require('./angular/controllers/guest/import/ledger.js');
angular.module('kyc-wallet').controller('GuestImportLedgerController', GuestImportLedgerController);

/**
 * create wallet
 */
const GuestKeystoreCreateStep1Controller = require('./angular/controllers/guest/create/step-1.controller.js');
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep1Controller', GuestKeystoreCreateStep1Controller);

const GuestKeystoreCreateStep2Controller = require('./angular/controllers/guest/create/step-2.controller.js');
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep2Controller', GuestKeystoreCreateStep2Controller);

const GuestKeystoreCreateStep3Controller = require('./angular/controllers/guest/create/step-3.controller.js');
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep3Controller', GuestKeystoreCreateStep3Controller);

const GuestKeystoreCreateStep4Controller = require('./angular/controllers/guest/create/step-4.controller.js');
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep4Controller', GuestKeystoreCreateStep4Controller);

const GuestKeystoreCreateStep5Controller = require('./angular/controllers/guest/create/step-5.controller.js');
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep5Controller', GuestKeystoreCreateStep5Controller);

const GuestKeystoreCreateStep6Controller = require('./angular/controllers/guest/create/step-6.controller.js');
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep6Controller', GuestKeystoreCreateStep6Controller);


/**
 * member
 */
const MemberLayoutController = require('./angular/controllers/member/layout-controller.js');
angular.module('kyc-wallet').controller('MemberLayoutController', MemberLayoutController);

const MemberRightSidenavController = require('./angular/controllers/member/right-sidenav-controller.js');
angular.module('kyc-wallet').controller('MemberRightSidenavController', MemberRightSidenavController);


/**
 * setup
 */
const MemberSetupLayoutController = require('./angular/controllers/member/setup/layout-controller.js');
angular.module('kyc-wallet').controller('MemberSetupLayoutController', MemberSetupLayoutController);

const MemberSetupChecklistController = require('./angular/controllers/member/setup/checklist-controller.js');
angular.module('kyc-wallet').controller('MemberSetupChecklistController', MemberSetupChecklistController);

const MemberSetupAddDocumentController = require('./angular/controllers/member/setup/add-document-controller.js');
angular.module('kyc-wallet').controller('MemberSetupAddDocumentController', MemberSetupAddDocumentController);


/**
 * dashboard
 */
const MemberDashboardMainController = require('./angular/controllers/member/dashboard/main-controller.js');
angular.module('kyc-wallet').controller('MemberDashboardMainController', MemberDashboardMainController);


/**
 * wallet (TODO rename to token)
 */
const ManageTokenController = require('./angular/controllers/member/wallet/manage-token-controller.js');
angular.module('kyc-wallet').controller('ManageTokenController', ManageTokenController);

const ManageCryptosController = require('./angular/controllers/member/wallet/manage-cryptos-controller.js');
angular.module('kyc-wallet').controller('ManageCryptosController', ManageCryptosController);


/**
 * id wallet
 */
const MemberIdWalletMainController = require('./angular/controllers/member/id-wallet/main-controller.js');
angular.module('kyc-wallet').controller('MemberIdWalletMainController', MemberIdWalletMainController);

/**
 * marketplace
 */
const MemberMarketplaceExchangeListController = require('./angular/controllers/member/marketplace/exchange-list-controller.js');
angular.module('kyc-wallet').controller('MemberMarketplaceExchangeListController', MemberMarketplaceExchangeListController);

const MemberMarketplaceExchangeItemController = require('./angular/controllers/member/marketplace/exchange-item-controller.js');
angular.module('kyc-wallet').controller('MemberMarketplaceExchangeItemController', MemberMarketplaceExchangeItemController);


/**
 * config states
 */
angular.module('kyc-wallet').config(appStates);

/**
 * config run
 */
angular.module('kyc-wallet').run(appRun);

/**
 * bootstrap app
 */
/*
angular.bootstrap(document, ['kyc-wallet'], {
  strictDi: true
});
*/
