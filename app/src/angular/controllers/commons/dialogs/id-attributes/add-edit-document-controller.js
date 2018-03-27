'use strict';

function AddEditDocumentDialogController($rootScope, $scope, $log, $mdDialog, SqlLiteService, RPCService, CommonService, mode, idAttributeType, idAttributeItemValue) {
    'ngInject'

    $log.info('AddEditDocumentDialogController');
    $scope.idAttributeType = idAttributeType;

    if (mode === 'update') {
        $scope.idAttributeItemValue = idAttributeItemValue;
    }

    $scope.selectedFile = null;

    $scope.close = (event) => {
        $mdDialog.cancel();
    };

    $scope.save = (event) => {
        if (!$scope.selectedFile) {
            return;
        }

        if (mode === 'create') {
            RPCService.makeCall('addIdAttribute', {
                walletId: $rootScope.wallet.id,
                idAttributeType: idAttributeType,
                staticData: null,
                file: $scope.selectedFile
            }).then(() => {
                CommonService.showToast('success', 'saved');
                $mdDialog.hide();
            }).catch((error) => {
                $log.error(error);
                CommonService.showToast('error', 'error while saving document');
            });
        } else {
            SqlLiteService.updateIdAttributeItemValueDocument(idAttributeItemValue, $scope.selectedFile).then(() => {
                $mdDialog.hide();
            }).catch((error) => {
                $log.error(error);
                CommonService.showToast('error', 'error while saving document');
            });
        }
    }

    $scope.selectFile = (event) => {
        let fileSelect = RPCService.makeCall('openFileSelectDialog', {
            filters: [
                { name: 'Documents', extensions: ['jpg', 'jpeg', 'png', 'pdf'] },
            ],
            maxFileSize: 50 * 1000 * 1000
        });
        fileSelect.then((selectedFile) => {
            $scope.selectedFile = selectedFile;
        }).catch((error) => {
            CommonService.showToast('error', 'The file could not be uploaded. The file exceeds the maximum upload size. Please upload file no larger than 50 MB.');
        });
    }
};

module.exports = AddEditDocumentDialogController;
