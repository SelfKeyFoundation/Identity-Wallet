function MemberIdentityMainController ($rootScope, $scope, $log, $mdDialog, ElectronService, ConfigFileService) {
    'ngInject'

    // TODO - TEST (REMOVE)
    $scope.openPdfSignature = (event) => {
        let config = {
            templateUrl: 'member/identity/dialogs/test-signature.html',
            controller: "TestSignatureDialog",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false
        };
        $mdDialog.show(config);
    }

    //$scope.openPdfSignature(null);
    // TODO - TEST (REMOVE)
    // TODO - take privateKey from config storage
    $scope.contactInfo;
    $scope.document;

    loadContactInfos ();
    loadDocuments ();
    
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
        for(let i = 0; i < $scope.contactInfo.length; i++){
            if($scope.contactInfo[i].id === item.id){
                $scope.contactInfo.splice(i, 1);
                break;
            }
        }

        // TODO: get current active key
        let promise = ConfigFileService.contactInfos_save("0x5abb838bbb2e566c236f4be6f283541bf8866b68", $scope.contactInfo);
        promise.then((result) => {
            $scope.contactItems = $scope.contactInfo;
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
            //$scope.documentItems = result;
            $scope.documentItems = null;
            loadDocuments ();
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
            //$scope.documentItems = result;
            $scope.documentItems = null;
            loadDocuments ();
        });
    }

    $scope.deleteDocument = (event, item) => {
        for(let i = 0; i < $scope.document.length; i++){
            if($scope.document[i].id === item.id){
                $scope.document.splice(i, 1);
                break;
            }
        }

        // TODO: get active key
        let promise = ConfigFileService.documents_save("0x5abb838bbb2e566c236f4be6f283541bf8866b68", $scope.document);
        promise.then((result) => {
            $scope.documentItems = $scope.document;
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

    function loadContactInfos () {
        $scope.contactInfoPromise = ConfigFileService.contactInfos_get("0x5abb838bbb2e566c236f4be6f283541bf8866b68");
        $scope.contactInfoPromise.then((result) => {
            $scope.contactInfo = angular.copy(result);
            $scope.contactItems = result;
        }).catch((error) => {
            $log.error(error);
        });
    }

    function loadDocuments (){
        $scope.documentsPromise = ConfigFileService.documents_get("0x5abb838bbb2e566c236f4be6f283541bf8866b68");
        $scope.documentsPromise.then((result) => {
            $scope.document = angular.copy(result);
            $scope.documentItems = result;
    
            for(let i in $scope.documentItems){
                if($scope.documentItems[i].filePath){
                    $scope.documentItems[i].fileInfoPromise = ElectronService.checkFileStat($scope.documentItems[i].filePath);
                }
            }
        }).catch((error) => {
            $log.error(error);
        });
    }
};

export default MemberIdentityMainController;
