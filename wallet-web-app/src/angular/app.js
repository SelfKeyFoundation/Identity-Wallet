'use strict';

// TODO - 
const APP_NAME = 'identity-wallet';

/**
 * External Modules
 */
import uiRouter from '@uirouter/angularjs';
import angularMaterial from 'angular-material';
import LocalStorageModule from 'angular-local-storage';
import qrcode from 'qrcode-generator';
import ngQrcode from 'angular-qrcode';
//import GoogleCharts from 'google-charts';


window.qrcode = qrcode;
//window.google = GoogleCharts;


/**
 * Internal Modules
 */
import appTemplates from './app.templates';
import appRun from './configs/app.run';
import appStates from './configs/app.states';

import appTestFilter from './filters/app.test.filter';

const requires = [
  'ngMaterial',
  'ui.router',
  'templates',
  'LocalStorageModule',
  'monospaced.qrcode'
];

/**
 * main module: 'kyc-wallet'
 */
window.app = angular.module('kyc-wallet', requires);

/**
 * constants
 */
import appConfigConstant from './constants/app.config.constant';
angular.module('kyc-wallet').constant('CONFIG', appConfigConstant);

import appDictionaryConstant from './constants/app.dictionary.constant';
angular.module('kyc-wallet').constant('DICTIONARY', appDictionaryConstant);

import appEventsConstant from './constants/app.events.constant';
angular.module('kyc-wallet').constant('EVENTS', appEventsConstant);

/**
 * filters
 */
angular.module('kyc-wallet').filter('testFilter', appTestFilter);

/**
 * services
 */
import ElectronService from './services/electron.service';
angular.module('kyc-wallet').service('ElectronService', ElectronService);

import ConfigStorageService from './services/config-storage.service';
angular.module('kyc-wallet').service('ConfigStorageService', ConfigStorageService);

import ConfigFileService from './services/config-file.service';
angular.module('kyc-wallet').service('ConfigFileService', ConfigFileService);

import CommonService from './services/common.service';
angular.module('kyc-wallet').service('CommonService', CommonService);

import EtherScanService from './services/ether-scan.service';
angular.module('kyc-wallet').service('EtherScanService', EtherScanService);

import MEWService from './services/mew.service';
angular.module('kyc-wallet').service('MEWService', MEWService);

import Web3Service from './services/web3.service';
angular.module('kyc-wallet').service('Web3Service', Web3Service);

import EtherUnitsService from './services/ether-units.service';
angular.module('kyc-wallet').service('EtherUnitsService', EtherUnitsService);

import WalletService from './services/wallet.service';
angular.module('kyc-wallet').service('WalletService', WalletService);

import TokenService from './services/token.service';
angular.module('kyc-wallet').service('TokenService', TokenService);

import SelfkeyService from './services/selfkey.service';
angular.module('kyc-wallet').service('SelfkeyService', SelfkeyService);

/**
 * directives
 */
import CountdownDirective from './directives/countdown.directive';
angular.module('kyc-wallet').directive('countdown', CountdownDirective);

import SkLoadingDirective from './directives/commons/sk-loading.directive';
angular.module('kyc-wallet').directive('skLoading', SkLoadingDirective);

import SkIconDirective from './directives/commons/sk-icon.directive';
angular.module('kyc-wallet').directive('skIcon', SkIconDirective);

import SkMessageDirective from './directives/commons/sk-message.directive';
angular.module('kyc-wallet').directive('skMessage', SkMessageDirective);

import SkSelectIfDirective from './directives/commons/sk-select-if.directive';
angular.module('kyc-wallet').directive('skSelectIf', SkSelectIfDirective);

import skShowLoading from './directives/commons/sk-show-loading.directive';
angular.module('kyc-wallet').directive('skShowLoading', skShowLoading);

import SkLinearProgressDirective from './directives/commons/sk-linear-progress.directive';
angular.module('kyc-wallet').directive('skLinearProgress', SkLinearProgressDirective);

import skSlider from './directives/commons/sk-slider.directive';
angular.module('kyc-wallet').directive('skSlider', skSlider);

import SkDoubleHeaderDirective from './directives/commons/sk-double-header.directive';
angular.module('kyc-wallet').directive('skDoubleHeader', SkDoubleHeaderDirective);

import SkTokenBoxDirective from './directives/commons/sk-token-box.directive';
angular.module('kyc-wallet').directive('skTokenBox', SkTokenBoxDirective);

import SkTasksBoxDirective from './directives/commons/sk-tasks-box.directive';
angular.module('kyc-wallet').directive('skTasksBox', SkTasksBoxDirective);

import SkIcoItemBoxDirective from './directives/commons/sk-ico-item-box.directive';
angular.module('kyc-wallet').directive('skIcoItemBox', SkIcoItemBoxDirective);

import SkIcoDetailsBoxDirective from './directives/commons/sk-ico-details-box.directive';
angular.module('kyc-wallet').directive('skIcoDetailsBox', SkIcoDetailsBoxDirective);

import SkSendTokenDirective from './directives/commons/sk-send-token.directive';
angular.module('kyc-wallet').directive('skSendToken', SkSendTokenDirective);

import SkRightSidenavDirective from './directives/commons/sk-right-sidenav.directive';
angular.module('kyc-wallet').directive('skRightSidenav', SkRightSidenavDirective);

import SkCirclePieChartDirective from './directives/commons/sk-circle-pie-chart.directive';
angular.module('kyc-wallet').directive('skCirclePieChart', SkCirclePieChartDirective);

import SkWalletHistoryItemDirective from './directives/commons/sk-wallet-history-item.directive';
angular.module('kyc-wallet').directive('skWalletHistoryItem', SkWalletHistoryItemDirective);

import SkRemindersBoxDirective from './directives/commons/sk-reminders-box.directive';
angular.module('kyc-wallet').directive('skRemindersBox', SkRemindersBoxDirective);

import SkAlertsBoxDirective from './directives/commons/sk-alerts-box.directive';
angular.module('kyc-wallet').directive('skAlertsBox', SkAlertsBoxDirective);

import SkWalletGeneralInfoBoxDirective from './directives/commons/sk-wallet-general-info-box.directive';
angular.module('kyc-wallet').directive('skWalletGeneralInfoBox', SkWalletGeneralInfoBoxDirective);

import SkIdAttributeBoxDirective from './directives/commons/sk-id-attribute-box.directive';
angular.module('kyc-wallet').directive('skIdAttributeBox', SkIdAttributeBoxDirective);

import SkUserInfoBoxDirective from './directives/commons/sk-user-info-box.directive';
angular.module('kyc-wallet').directive('skUserInfoBox', SkUserInfoBoxDirective);

import SkKycRequirementsBoxDirective from './directives/commons/sk-kyc-requirements-box.directive';
angular.module('kyc-wallet').directive('skKycRequirementsBox', SkKycRequirementsBoxDirective);


/**
 * controllers
 */

/**
 * commons
 */
import TermsDialogController from './controllers/commons/dialogs/terms-controller.js';
angular.module('kyc-wallet').controller('TermsDialogController', TermsDialogController);

import StartupGuideDialogController from './controllers/commons/dialogs/startup-guide-controller.js';
angular.module('kyc-wallet').controller('StartupGuideDialogController', StartupGuideDialogController);

import ReceiveTokenDialogController from './controllers/commons/dialogs/receive-token-controller.js';
angular.module('kyc-wallet').controller('ReceiveTokenDialogController', ReceiveTokenDialogController);

import AddCustomTokenDialogController from './controllers/commons/dialogs/add-custom-token-controller.js';
angular.module('kyc-wallet').controller('AddCustomTokenDialogController', AddCustomTokenDialogController);

/**
 * guest
 */
import GuestLayoutController from './controllers/guest/layout-controller.js';
angular.module('kyc-wallet').controller('GuestLayoutController', GuestLayoutController);

import GuestLoadingController from './controllers/guest/loading-controller.js';
angular.module('kyc-wallet').controller('GuestLoadingController', GuestLoadingController);

import GuestCreateKeystoreController from './controllers/guest/process/create-keystore-controller.js';
angular.module('kyc-wallet').controller('GuestCreateKeystoreController', GuestCreateKeystoreController);

import GuestImportKeystoreController from './controllers/guest/process/import-keystore-controller.js';
angular.module('kyc-wallet').controller('GuestImportKeystoreController', GuestImportKeystoreController);

import GuestUnlockKeystoreController from './controllers/guest/process/unlock-keystore-controller.js';
angular.module('kyc-wallet').controller('GuestUnlockKeystoreController', GuestUnlockKeystoreController);

/**
 * member
 */
import MemberLayoutController from './controllers/member/layout-controller.js';
angular.module('kyc-wallet').controller('MemberLayoutController', MemberLayoutController);

import MemberRightSidenavController from './controllers/member/right-sidenav-controller.js';
angular.module('kyc-wallet').controller('MemberRightSidenavController', MemberRightSidenavController);

/**
 * setup
 */
import MemberSetupViewKeystoreController from './controllers/member/setup/view-keystore-controller.js';
angular.module('kyc-wallet').controller('MemberSetupViewKeystoreController', MemberSetupViewKeystoreController);

import MemberSetupStep1Controller from './controllers/member/setup/step-1-controller.js';
angular.module('kyc-wallet').controller('MemberSetupStep1Controller', MemberSetupStep1Controller);

import MemberSetupStep2Controller from './controllers/member/setup/step-2-controller.js';
angular.module('kyc-wallet').controller('MemberSetupStep2Controller', MemberSetupStep2Controller);

import MemberSetupStep3Controller from './controllers/member/setup/step-3-controller.js';
angular.module('kyc-wallet').controller('MemberSetupStep3Controller', MemberSetupStep3Controller);

import MemberSetupWalletSetupController from './controllers/member/setup/wallet-setup-controller.js';
angular.module('kyc-wallet').controller('MemberSetupWalletSetupController', MemberSetupWalletSetupController);


/**
 * dashboard
 */
import MemberDashboardMainController from './controllers/member/dashboard/main-controller.js';
angular.module('kyc-wallet').controller('MemberDashboardMainController', MemberDashboardMainController);

/**
 * wallet
 */
import MemberWalletMainController from './controllers/member/wallet/main-controller.js';
angular.module('kyc-wallet').controller('MemberWalletMainController', MemberWalletMainController);

import ManageTokenController from './controllers/member/wallet/manage-token-controller.js';
angular.module('kyc-wallet').controller('ManageTokenController', ManageTokenController);

/**
 * settings
 */
import MemberSettingsMainController from './controllers/member/settings/main-controller.js';
angular.module('kyc-wallet').controller('MemberSettingsMainController', MemberSettingsMainController);

/**
 * Marketplace
 */
import MemberMarketplaceMainController from './controllers/member/marketplace/main-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceMainController', MemberMarketplaceMainController);

import MemberMarketplaceIcoListController from './controllers/member/marketplace/ico/list-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceIcoListController', MemberMarketplaceIcoListController);

import MemberMarketplaceIcoItemController from './controllers/member/marketplace/ico/item-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceIcoItemController', MemberMarketplaceIcoItemController);

import MemberMarketplaceIcoManageRequirementsController from './controllers/member/marketplace/ico/manage-requirements-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceIcoManageRequirementsController', MemberMarketplaceIcoManageRequirementsController);

import MemberMarketplaceIcoAcceptTermsController from './controllers/member/marketplace/ico/accept-terms-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceIcoAcceptTermsController', MemberMarketplaceIcoAcceptTermsController);

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