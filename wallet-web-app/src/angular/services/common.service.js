'use strict';

function CommonService($rootScope, $log, $q, $mdDialog) {
  'ngInject';

  $log.debug('CommonService Initialized');

  let CommonService = function (data) {
    angular.extend(this, data);
  }

  /**
   * 
   */
  CommonService.prototype.openChooseUserDirectoryDialog = (showCancelButton) => {
    return $mdDialog.show({
      templateUrl: 'common/dialogs/user-documents-storage-path.html',
      controller: 'UserDocumentsStoragePathDialog',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      fullscreen: false,
      locals: {
        showCancelButton: showCancelButton
      }
    });
  }

  CommonService.prototype.openUserAgreementDialog = (showActionButtons) => {
    return $mdDialog.show({
      templateUrl: 'common/dialogs/legal-tems-and-conditions.html',
      controller: "LegalTermsAndConditionsDialog",
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      fullscreen: false,
      locals: {
        showActionButtons: showActionButtons || true
      }
    });
  }

  return new CommonService();
}

export default CommonService;