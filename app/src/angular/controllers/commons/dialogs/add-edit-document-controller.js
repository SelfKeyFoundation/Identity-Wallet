'use strict';

function AddEditDocumentDialogController($rootScope, $scope, $log, $mdDialog, SqlLiteService, RPCService, CommonService, idAttributeItemValue, idAttributeType) {
    'ngInject'

    $log.info('AddEditDocumentDialogController');

    $scope.idAttributeItemValue = idAttributeItemValue;
    $scope.idAttributeType = idAttributeType;

    $scope.selectedFile = null;

    $scope.close = (event) => {
        $mdDialog.cancel();
    };

    $scope.save = (event) => {
        if ($scope.selectedFile) {
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
                {name: 'Documents', extensions: ['jpg', 'png', 'pdf']},
            ],
            maxFileSize: 50 * 1000 * 1000
        });
        fileSelect.then((selectedFile) => {
            $scope.selectedFile = selectedFile;
        }).catch((error) => {
            CommonService.showToast('error', 'Max File Size: 50mb Allowed');
        });
    }
};

module.exports = AddEditDocumentDialogController;
