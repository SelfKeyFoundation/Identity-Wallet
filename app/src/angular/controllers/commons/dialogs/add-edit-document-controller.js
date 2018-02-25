function AddEditDocumentDialogController($rootScope, $scope, $log, $q, $mdDialog, ConfigFileService, CommonService, ElectronService, item, value, idAttributeType) {
    'ngInject'

    $log.info('AddEditDocumentDialogController', item, value, idAttributeType);

    $scope.item = item;
    $scope.value = value;
    $scope.idAttributeType = idAttributeType;

    $scope.fileItem = value ? value.value : null;

    $scope.close = (event) => {
        $mdDialog.hide();
    };

    $scope.save = (event) => {
        $mdDialog.hide($scope.fileItem);
    }

    $scope.selectFile = (event) => {
        let fileSelectPromise = ElectronService.openFileSelectDialog({
            filters: [
                { name: 'Documents', extensions: ['jpg', 'png', 'pdf'] },
            ],
            maxFileSize: 50 * 1000 * 1000
        });

        let store = ConfigFileService.getStore();

        fileSelectPromise.then((resp) => {
            if (!resp || !resp.path) return;

            let moveFilePrimise = ElectronService.moveFile(resp.path, store.settings.documentsDirectoryPath);
            moveFilePrimise.then((filePath) => {
                let fileItem = {
                    name: resp.name,
                    mimeType: resp.mimeType,
                    size: resp.size,
                    path: filePath,
                }

                $scope.fileItem = fileItem;
            }).catch((error) => {
                $log.error(error);
                CommonService.showToast('error', 'Error while selecting document');
            });
        }).catch((error) => {
            CommonService.showToast('error', 'Max File Size: 50mb Allowed');
        });
    }
};

module.exports = AddEditDocumentDialogController;
