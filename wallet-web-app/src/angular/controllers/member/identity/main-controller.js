function MemberIdentityMainController ($rootScope, $scope, $log, $mdDialog, IndexedDBService) {
    'ngInject'

    // TODO - take privateKey from config storage
    $scope.contactInfo;
    $scope.contactInfoPromise = IndexedDBService.contactInfos_get("0x5abb838bbb2e566c236f4be6f283541bf8866b68");
    $scope.contactInfoPromise.then((result) => {
        $scope.contactInfo = angular.copy(result);
        $log.info(result.data);
        $scope.contactItems = result.data;
    }).catch((error) => {
        $log.error(error);
    });

    $scope.document;
    $scope.documentsPromise = IndexedDBService.documents_get("0x5abb838bbb2e566c236f4be6f283541bf8866b68");
    $scope.documentsPromise.then((result) => {
        $scope.document = angular.copy(result);
        $log.info(result.data);
        $scope.documentItems = result.data;
    }).catch((error) => {
        $log.error(error);
    });

    $scope.addContactInfo = (event) => {
        let config = {
            templateUrl: 'member/identity/dialogs/add-edit-contact-info.html',
            controller: "AddEditContactInfoDialog",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false,
            locals: {
                contactInfoRecord: $scope.contactInfo,
                contactItem: null
            }
        };
        $mdDialog.show(config).then((result) => {
            $scope.contactItems = result;
        });
    }

    $scope.editContactInfo = (event, contactItem) => {
        let config = {
            templateUrl: 'member/identity/dialogs/add-edit-contact-info.html',
            controller: "AddEditContactInfoDialog",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false,
            locals: {
                contactInfoRecord: $scope.contactInfo,
                contactItem: angular.copy(contactItem)
            }
        };
        $mdDialog.show(config).then((result) => {
            $scope.contactItems = result;
        });
    }

    $scope.addDocument = (event) => {
        let config = {
            templateUrl: 'member/identity/dialogs/add-edit-document.html',
            controller: "AddEditDocumentDialog",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false,
            locals: {
                documentRecord: $scope.document,
                documentItem: null
            }
        };
        $mdDialog.show(config).then((result) => {
            $scope.documentItems = result;
        });
    }
};

export default MemberIdentityMainController;
