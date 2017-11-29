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

import appDictionaryConstant from './constants/app.dictionary.constant';
import appConfigConstant from './constants/app.config.constant';
import appEventsConstant from './constants/app.events.constant';

import appTestFilter from './filters/app.test.filter';

import AnimationService from './services/animation.service';
import ElectronService from './services/electron.service';
import ConfigStorageService from './services/config-storage.service';
//import IndexedDBService from './services/indexed-db.service';
import ConfigFileService from './services/config-file.service';
import CommonService from './services/common.service';
import EtherScanService from './services/ether-scan.service';
import EtherUnitsService from './services/ether-units.service';
import WalletService from './services/wallet.service';
import TokenService from './services/token.service';

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
angular.module('kyc-wallet').constant('CONFIG', appConfigConstant);
angular.module('kyc-wallet').constant('DICTIONARY', appDictionaryConstant);
angular.module('kyc-wallet').constant('EVENTS', appEventsConstant);

/**
 * filters
 */
angular.module('kyc-wallet').filter('testFilter', appTestFilter);

/**
 * services
 */
angular.module('kyc-wallet').service('AnimationService', AnimationService);
angular.module('kyc-wallet').service('ElectronService', ElectronService);
angular.module('kyc-wallet').service('ConfigStorageService', ConfigStorageService);
//angular.module('kyc-wallet').service('IndexedDBService', IndexedDBService);
angular.module('kyc-wallet').service('ConfigFileService', ConfigFileService);
angular.module('kyc-wallet').service('CommonService', CommonService);
angular.module('kyc-wallet').service('EtherScanService', EtherScanService);
angular.module('kyc-wallet').service('EtherUnitsService', EtherUnitsService);
angular.module('kyc-wallet').service('WalletService', WalletService);
angular.module('kyc-wallet').service('TokenService', TokenService);

/**
 * directives
 */
import CountdownDirective from './directives/countdown.directive';
angular.module('kyc-wallet').directive('countdown', CountdownDirective);

import KycProfileImageDirective from './directives/kyc-profile-image.directive';
angular.module('kyc-wallet').directive('kycProfileImage', KycProfileImageDirective);

import SkLoadingDirective from './directives/commons/sk-loading.directive';
angular.module('kyc-wallet').directive('skLoading', SkLoadingDirective);

import SkIconDirective from './directives/commons/sk-icon.directive';
angular.module('kyc-wallet').directive('skIcon', SkIconDirective);

import SkMessageDirective from './directives/commons/sk-message.directive';
angular.module('kyc-wallet').directive('skMessage', SkMessageDirective);

import SkSelectIfDirective from './directives/commons/sk-select-if.directive';
angular.module('kyc-wallet').directive('skSelectIf', SkSelectIfDirective);

import SkLinearProgressDirective from './directives/commons/sk-linear-progress.directive';
angular.module('kyc-wallet').directive('skLinearProgress', SkLinearProgressDirective);

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





import MemberIdentityMainController from './controllers/member/identity/main-controller.js';
import AddEditContactInfoDialog from './controllers/member/identity/dialogs/add-edit-contcat-info.js';
import AddEditDocumentDialog from './controllers/member/identity/dialogs/add-edit-document.js';
import TestSignatureDialog from './controllers/member/identity/dialogs/test-signature.js'; // TEST

import MemberProfileMainController from './controllers/member/profile-controller.js';
import MemberSettingsMainController from './controllers/member/settings/main-controller.js';

import UserDocumentsStoragePathDialog from './controllers/common/dialogs/user-documents-storage-path-controller.js';
import LegalTermsAndConditionsDialog from './controllers/common/dialogs/legal-terms-and-conditions-controller.js';

angular.module('kyc-wallet').controller('MemberLayoutController', MemberLayoutController);
angular.module('kyc-wallet').controller('MemberIdentityMainController', MemberIdentityMainController);
angular.module('kyc-wallet').controller('AddEditContactInfoDialog', AddEditContactInfoDialog);
angular.module('kyc-wallet').controller('AddEditDocumentDialog', AddEditDocumentDialog);
angular.module('kyc-wallet').controller('TestSignatureDialog', TestSignatureDialog); // TEST

angular.module('kyc-wallet').controller('MemberProfileController', MemberProfileMainController);
angular.module('kyc-wallet').controller('MemberSettingsMainController', MemberSettingsMainController);

angular.module('kyc-wallet').controller('UserDocumentsStoragePathDialog', UserDocumentsStoragePathDialog);
angular.module('kyc-wallet').controller('LegalTermsAndConditionsDialog', LegalTermsAndConditionsDialog);


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