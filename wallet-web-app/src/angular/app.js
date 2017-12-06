'use strict';

// TODO - 
const APP_NAME = 'identity-wallet';

/**
 * External Modules
 */
import uiRouter from '@uirouter/angularjs';
import angularMaterial from 'angular-material';
import LocalStorageModule from 'angular-local-storage';

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
  'LocalStorageModule'
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

import EtherUnitsService from './services/ether-units.service';
angular.module('kyc-wallet').service('EtherUnitsService', EtherUnitsService);

import WalletService from './services/wallet.service';
angular.module('kyc-wallet').service('WalletService', WalletService);

import TokenService from './services/token.service';
angular.module('kyc-wallet').service('TokenService', TokenService);

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

import SkIcoBoxDirective from './directives/commons/sk-ico-box.directive';
angular.module('kyc-wallet').directive('skIcoBox', SkIcoBoxDirective);



/**
 * controllers
 */

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

/**
 * settings
 */
import MemberSettingsMainController from './controllers/member/settings/main-controller.js';
angular.module('kyc-wallet').controller('MemberSettingsMainController', MemberSettingsMainController);


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