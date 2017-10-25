function MemberIdentityMainController ($rootScope, $scope, $log, $mdDialog, ElectronService, IndexedDBService) {
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
        $scope.documentItems = result.data;

        for(let i in $scope.documentItems){
            if($scope.documentItems[i].filePath){
                $scope.documentItems[i].fileInfoPromise = ElectronService.checkFileStat($scope.documentItems[i].filePath);
            }
        }
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

    $scope.deleteContactInfo = (event, item) => {
        for(let i = 0; i < $scope.contactInfo.data.length; i++){
            if($scope.contactInfo.data[i].id === item.id){
                $scope.contactInfo.data.splice(i, 1);
                break;
            }
        }

        let promise = IndexedDBService.contactInfos_save($scope.contactInfo);
        promise.then((result) => {
            $scope.contactItems = $scope.contactInfo.data;
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

    $scope.editDocument = (event, documentItem) => {
        let config = {
            templateUrl: 'member/identity/dialogs/add-edit-document.html',
            controller: "AddEditDocumentDialog",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false,
            locals: {
                documentRecord: $scope.document,
                documentItem: documentItem
            }
        };
        $mdDialog.show(config).then((result) => {
            $scope.documentItems = result;
        });
    }

    $scope.deleteDocument = (event, item) => {
        for(let i = 0; i < $scope.document.data.length; i++){
            if($scope.document.data[i].id === item.id){
                $scope.document.data.splice(i, 1);
                break;
            }
        }

        let promise = IndexedDBService.documents_save($scope.document);
        promise.then((result) => {
            $scope.documentItems = $scope.document.data;
        });
    }

    /**
     * 
     */
    $scope.getFileInfo = (item) => {
        if(item.filePath){
            item.fileInfoPromise = ElectronService.checkFileStat(item.filePath);
        }
    }
};

export default MemberIdentityMainController;
