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
//import appTemplates from './app.templates';
require('./angular/app.templates');
import appRun from './angular/configs/app.run';
import appStates from './angular/configs/app.states';

import appTestFilter from './angular/filters/app.test.filter';

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
const AppConfigConstant = require('../config');

let devModeStarted = false;
if(process.argv.length > 2) {
	if(process.argv[2] === 'dev') {
		devModeStarted = true;
	}
}
let extraConfig = AppConfigConstant.production;
if(devModeStarted) {
	extraConfig = AppConfigConstant.default;
}
const config = Object.assign(AppConfigConstant.common, extraConfig);
angular.module('kyc-wallet').constant('CONFIG', config);

import appDictionaryConstant from './angular/constants/app.dictionary.constant';
angular.module('kyc-wallet').constant('DICTIONARY', appDictionaryConstant);

import appEventsConstant from './angular/constants/app.events.constant';
angular.module('kyc-wallet').constant('EVENTS', appEventsConstant);

import countriesConstant from './angular/constants/countries';
angular.module('kyc-wallet').constant('countries', countriesConstant);

/**
 * filters
 */
angular.module('kyc-wallet').filter('testFilter', appTestFilter);

/**
 * services
 */
import ElectronService from './angular/services/electron.service';
angular.module('kyc-wallet').service('ElectronService', ElectronService);

import ConfigStorageService from './angular/services/config-storage.service';
angular.module('kyc-wallet').service('ConfigStorageService', ConfigStorageService);

import ConfigFileService from './angular/services/config-file.service';
angular.module('kyc-wallet').service('ConfigFileService', ConfigFileService);

import CommonService from './angular/services/common.service';
angular.module('kyc-wallet').service('CommonService', CommonService);

import EtherScanService from './angular/services/ether-scan.service';
angular.module('kyc-wallet').service('EtherScanService', EtherScanService);

import MEWService from './angular/services/mew.service';
angular.module('kyc-wallet').service('MEWService', MEWService);

import Web3Service from './angular/services/web3.service';
angular.module('kyc-wallet').service('Web3Service', Web3Service);

import EtherUnitsService from './angular/services/ether-units.service';
angular.module('kyc-wallet').service('EtherUnitsService', EtherUnitsService);

import WalletService from './angular/services/wallet.service';
angular.module('kyc-wallet').service('WalletService', WalletService);

import TokenService from './angular/services/token.service';
angular.module('kyc-wallet').service('TokenService', TokenService);

import SelfkeyService from './angular/services/selfkey.service';
angular.module('kyc-wallet').service('SelfkeyService', SelfkeyService);

/**
 * directives
 */
import CountdownDirective from './angular/directives/countdown.directive';
angular.module('kyc-wallet').directive('countdown', CountdownDirective);

import SkLoadingDirective from './angular/directives/commons/sk-loading.directive';
angular.module('kyc-wallet').directive('skLoading', SkLoadingDirective);

import SkIconDirective from './angular/directives/commons/sk-icon.directive';
angular.module('kyc-wallet').directive('skIcon', SkIconDirective);

import SkMessageDirective from './angular/directives/commons/sk-message.directive';
angular.module('kyc-wallet').directive('skMessage', SkMessageDirective);

import SkSelectIfDirective from './angular/directives/commons/sk-select-if.directive';
angular.module('kyc-wallet').directive('skSelectIf', SkSelectIfDirective);

import skShowLoading from './angular/directives/commons/sk-show-loading.directive';
angular.module('kyc-wallet').directive('skShowLoading', skShowLoading);

import SkLinearProgressDirective from './angular/directives/commons/sk-linear-progress.directive';
angular.module('kyc-wallet').directive('skLinearProgress', SkLinearProgressDirective);

import skSlider from './angular/directives/commons/sk-slider.directive';
angular.module('kyc-wallet').directive('skSlider', skSlider);

import SkDoubleHeaderDirective from './angular/directives/commons/sk-double-header.directive';
angular.module('kyc-wallet').directive('skDoubleHeader', SkDoubleHeaderDirective);

import SkTokenBoxDirective from './angular/directives/commons/sk-token-box.directive';
angular.module('kyc-wallet').directive('skTokenBox', SkTokenBoxDirective);

import SkTasksBoxDirective from './angular/directives/commons/sk-tasks-box.directive';
angular.module('kyc-wallet').directive('skTasksBox', SkTasksBoxDirective);

import SkIcoItemBoxDirective from './angular/directives/commons/sk-ico-item-box.directive';
angular.module('kyc-wallet').directive('skIcoItemBox', SkIcoItemBoxDirective);

import SkIcoDetailsBoxDirective from './angular/directives/commons/sk-ico-details-box.directive';
angular.module('kyc-wallet').directive('skIcoDetailsBox', SkIcoDetailsBoxDirective);

import SkSendTokenDirective from './angular/directives/commons/sk-send-token.directive';
angular.module('kyc-wallet').directive('skSendToken', SkSendTokenDirective);

import SkRightSidenavDirective from './angular/directives/commons/sk-right-sidenav.directive';
angular.module('kyc-wallet').directive('skRightSidenav', SkRightSidenavDirective);

import SkCirclePieChartDirective from './angular/directives/commons/sk-circle-pie-chart.directive';
angular.module('kyc-wallet').directive('skCirclePieChart', SkCirclePieChartDirective);

import SkWalletHistoryItemDirective from './angular/directives/commons/sk-wallet-history-item.directive';
angular.module('kyc-wallet').directive('skWalletHistoryItem', SkWalletHistoryItemDirective);

import SkRemindersBoxDirective from './angular/directives/commons/sk-reminders-box.directive';
angular.module('kyc-wallet').directive('skRemindersBox', SkRemindersBoxDirective);

import SkWalletGeneralInfoBoxDirective from './angular/directives/commons/sk-wallet-general-info-box.directive';
angular.module('kyc-wallet').directive('skWalletGeneralInfoBox', SkWalletGeneralInfoBoxDirective);

import SkIdAttributeBoxDirective from './angular/directives/commons/sk-id-attribute-box.directive';
angular.module('kyc-wallet').directive('skIdAttributeBox', SkIdAttributeBoxDirective);

import SkUserInfoBoxDirective from './angular/directives/commons/sk-user-info-box.directive';
angular.module('kyc-wallet').directive('skUserInfoBox', SkUserInfoBoxDirective);

import SkKycRequirementsBoxDirective from './angular/directives/commons/sk-kyc-requirements-box.directive';
angular.module('kyc-wallet').directive('skKycRequirementsBox', SkKycRequirementsBoxDirective);

import SkActionLogsBoxDirective from './angular/directives/commons/sk-action-logs-box.directive';
angular.module('kyc-wallet').directive('skActionLogsBox', SkActionLogsBoxDirective);

import ScrollToEndDirective from './angular/directives/commons/scroll-to-end.directive';
angular.module('kyc-wallet').directive('scrollToEnd', ScrollToEndDirective);


/**
 * controllers
 */

/**
 * commons
 */
import TermsDialogController from './angular/controllers/commons/dialogs/terms-controller.js';
angular.module('kyc-wallet').controller('TermsDialogController', TermsDialogController);

import StartupGuideDialogController from './angular/controllers/commons/dialogs/startup-guide-controller.js';
angular.module('kyc-wallet').controller('StartupGuideDialogController', StartupGuideDialogController);

import ReceiveTokenDialogController from './angular/controllers/commons/dialogs/receive-token-controller.js';
angular.module('kyc-wallet').controller('ReceiveTokenDialogController', ReceiveTokenDialogController);

import AddCustomTokenDialogController from './angular/controllers/commons/dialogs/add-custom-token-controller.js';
angular.module('kyc-wallet').controller('AddCustomTokenDialogController', AddCustomTokenDialogController);

import SendTokenDialogController from './angular/controllers/commons/dialogs/send-token-controller.js';
angular.module('kyc-wallet').controller('SendTokenDialogController', SendTokenDialogController);

import AddIdAttributeDialog from './angular/controllers/commons/dialogs/add-id-attribute-controller.js';
angular.module('kyc-wallet').controller('AddIdAttributeDialog', AddIdAttributeDialog);

/**
 * guest
 */
import GuestLayoutController from './angular/controllers/guest/layout-controller.js';
angular.module('kyc-wallet').controller('GuestLayoutController', GuestLayoutController);

import GuestLoadingController from './angular/controllers/guest/loading-controller.js';
angular.module('kyc-wallet').controller('GuestLoadingController', GuestLoadingController);

import GuestCreateKeystoreController from './angular/controllers/guest/process/create-keystore-controller.js';
angular.module('kyc-wallet').controller('GuestCreateKeystoreController', GuestCreateKeystoreController);

import GuestImportKeystoreController from './angular/controllers/guest/process/import-keystore-controller.js';
angular.module('kyc-wallet').controller('GuestImportKeystoreController', GuestImportKeystoreController);

import GuestUnlockKeystoreController from './angular/controllers/guest/process/unlock-keystore-controller.js';
angular.module('kyc-wallet').controller('GuestUnlockKeystoreController', GuestUnlockKeystoreController);

import GuestKeystoreCreateStep1Controller from './angular/controllers/guest/keystore/create/step-1-controller.js';
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep1Controller', GuestKeystoreCreateStep1Controller);

import GuestKeystoreCreateStep2Controller from './angular/controllers/guest/keystore/create/step-2-controller.js';
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep2Controller', GuestKeystoreCreateStep2Controller);

import GuestKeystoreCreateStep3Controller from './angular/controllers/guest/keystore/create/step-3-controller.js';
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep3Controller', GuestKeystoreCreateStep3Controller);

import GuestKeystoreCreateStep4Controller from './angular/controllers/guest/keystore/create/step-4-controller.js';
angular.module('kyc-wallet').controller('GuestKeystoreCreateStep4Controller', GuestKeystoreCreateStep4Controller);



/**
 * member
 */
import MemberLayoutController from './angular/controllers/member/layout-controller.js';
angular.module('kyc-wallet').controller('MemberLayoutController', MemberLayoutController);

import MemberRightSidenavController from './angular/controllers/member/right-sidenav-controller.js';
angular.module('kyc-wallet').controller('MemberRightSidenavController', MemberRightSidenavController);

/**
 * setup
 */
import MemberSetupViewKeystoreController from './angular/controllers/member/setup/view-keystore-controller.js';
angular.module('kyc-wallet').controller('MemberSetupViewKeystoreController', MemberSetupViewKeystoreController);

import MemberSetupStep1Controller from './angular/controllers/member/setup/step-1-controller.js';
angular.module('kyc-wallet').controller('MemberSetupStep1Controller', MemberSetupStep1Controller);

import MemberSetupStep2Controller from './angular/controllers/member/setup/step-2-controller.js';
angular.module('kyc-wallet').controller('MemberSetupStep2Controller', MemberSetupStep2Controller);

import MemberSetupStep3Controller from './angular/controllers/member/setup/step-3-controller.js';
angular.module('kyc-wallet').controller('MemberSetupStep3Controller', MemberSetupStep3Controller);

import MemberSetupWalletSetupController from './angular/controllers/member/setup/wallet-setup-controller.js';
angular.module('kyc-wallet').controller('MemberSetupWalletSetupController', MemberSetupWalletSetupController);

import MemberSetupCompletedController from './angular/controllers/member/setup/completed-controller.js';
angular.module('kyc-wallet').controller('MemberSetupCompletedController', MemberSetupCompletedController);

/**
 * dashboard
 */
import MemberDashboardMainController from './angular/controllers/member/dashboard/main-controller.js';
angular.module('kyc-wallet').controller('MemberDashboardMainController', MemberDashboardMainController);

/**
 * wallet
 */
import MemberWalletMainController from './angular/controllers/member/wallet/main-controller.js';
angular.module('kyc-wallet').controller('MemberWalletMainController', MemberWalletMainController);

import ManageTokenController from './angular/controllers/member/wallet/manage-token-controller.js';
angular.module('kyc-wallet').controller('ManageTokenController', ManageTokenController);

/**
 * settings
 */
import MemberSettingsMainController from './angular/controllers/member/settings/main-controller.js';
angular.module('kyc-wallet').controller('MemberSettingsMainController', MemberSettingsMainController);

/**
 * Marketplace
 */
import MemberMarketplaceMainController from './angular/controllers/member/marketplace/main-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceMainController', MemberMarketplaceMainController);

import MemberMarketplaceIcoListController from './angular/controllers/member/marketplace/ico/list-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceIcoListController', MemberMarketplaceIcoListController);

import MemberMarketplaceIcoItemController from './angular/controllers/member/marketplace/ico/item-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceIcoItemController', MemberMarketplaceIcoItemController);

import MemberMarketplaceIcoManageRequirementsController from './angular/controllers/member/marketplace/ico/manage-requirements-controller.js';
angular.module('kyc-wallet').controller('MemberMarketplaceIcoManageRequirementsController', MemberMarketplaceIcoManageRequirementsController);

import MemberMarketplaceIcoAcceptTermsController from './angular/controllers/member/marketplace/ico/accept-terms-controller.js';
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
