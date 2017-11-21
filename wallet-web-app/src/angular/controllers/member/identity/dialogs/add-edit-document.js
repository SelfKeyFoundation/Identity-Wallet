function AddEditDocumentDialog($rootScope, $scope, $log, $mdDialog, ElectronService, ConfigFileService, ConfigStorageService, documentRecord, documentItem) {
    'ngInject'

    $log.info('AddEditDocumentDialog');

    $scope.document = {
        attestations: 0
    };

    if (documentItem) {
        angular.extend($scope.document, documentItem);
        $scope.filePath = angular.copy(documentItem.filePath);
        delete $scope.document.fileInfoPromise;
    }

    $scope.filePath;
    $scope.chooseFile = (event) => {
        ElectronService.openFileSelectDialog().then((filePath) => {
            $scope.filePath = filePath;
        });
    }

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.save = (event) => {
        $log.info('target document to save', $scope.document);
        $log.info('documentRecord', documentRecord);

        if (documentItem) {
            // edit
            for (let i in documentRecord) {
                let item = documentRecord[i];
                if (item.id === documentItem.id) {
                    documentRecord[i] = $scope.document;
                    break;
                }
            }
        } else {
            // add
            $scope.document.id = ConfigFileService.generateId();
            documentRecord.push($scope.document);
        }

        let moveFilePromise = ElectronService.moveFile(
            $scope.filePath,
            ConfigStorageService.USER_DOCUMENTS_STORAGE_PATH
        );

        moveFilePromise.then((filePathToSave) => {
            $scope.document.filePath = filePathToSave;
            // TODO: get current active key
            let savePromise = ConfigFileService.documents_save("0x5abb838bbb2e566c236f4be6f283541bf8866b68", documentRecord);
            savePromise.then((result) => {
                $mdDialog.hide(documentRecord);
            });
        }).catch((error) => {
            console.log("filePathToSave error", error);
        });
    }
};

export default AddEditDocumentDialog;
