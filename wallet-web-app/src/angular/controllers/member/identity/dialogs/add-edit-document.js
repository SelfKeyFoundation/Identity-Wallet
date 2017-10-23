function AddEditDocumentDialog($rootScope, $scope, $log, $mdDialog, ElectronService, IndexedDBService, ConfigStorageService, documentRecord, documentItem) {
    'ngInject'

    $log.info('AddEditDocumentDialog');

    $scope.document = {
        attestations: 0
    };

    if (documentItem) {
        angular.extend($scope.document, documentItem);
    }

    $scope.filePath;
    $scope.chooseFile = (event) => {
        ElectronService.sendChooseFilePathRequest().then((filePath) => {
            $scope.filePath = filePath;
        });
    }
    
    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.save = (event) => {
        $log.info('target document to save', $scope.document);
        $log.info('documentRecord', documentRecord);

        if (typeof $scope.document.privacy === 'string') {
            $scope.document.privacy = $scope.document.privacy === '1' ? 1 : 0;
        }

        if (documentItem) {
            // edit
            for (let i in documentRecord.data) {
                let item = documentRecord.data[i];
                if (item.id === documentItem.id) {
                    documentRecord.data[i] = $scope.document;
                    break;
                }
            }
        } else {
            // add
            $scope.document.id = IndexedDBService.generateId();
            documentRecord.data.push($scope.document);
        }

        let moveFilePromise = ElectronService.sendMoveFileRequest(
            $scope.filePath, 
            ConfigStorageService.USER_DOCUMENTS_STORAGE_PATH
        );

        moveFilePromise.then((filePathToSave)=>{
            console.log("filePathToSave", filePathToSave);
            let savePromise = IndexedDBService.documents_save(documentRecord);
            savePromise.then((result) => {
                $mdDialog.hide(documentRecord.data);
            });
        }).catch((error)=>{
            console.log("filePathToSave error", error);
        });
    }
};

export default AddEditDocumentDialog;
