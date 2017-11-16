'use strict';

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

import appTestFilter from './filters/app.test.filter';

import AnimationService from './services/animation.service';
import ElectronService from './services/electron.service';
import ConfigStorageService from './services/config-storage.service';
//import IndexedDBService from './services/indexed-db.service';
import ConfigFileService from './services/config-file.service';
import CommonService from './services/common.service';
import EtherscanService from './services/etherscan.service';
import EtherUnitsService from './services/ether-units.service';

import CountdownDirective from './directives/countdown.directive';
import KycProfileImageDirective from './directives/kyc-profile-image.directive';

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
angular.module('kyc-wallet').service('EtherscanService', EtherscanService);
angular.module('kyc-wallet').service('EtherUnitsService', EtherUnitsService);

/**
 * directives
 */
angular.module('kyc-wallet').directive('countdown', CountdownDirective);
angular.module('kyc-wallet').directive('kycProfileImage', KycProfileImageDirective);

/**
 * controllers
 */
import MemberLayoutController from './controllers/member/layout-controller.js';

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