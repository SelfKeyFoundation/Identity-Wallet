'use strict';

function DocumentPreviewDialogController($rootScope, $scope, $log, $mdDialog, $sce, CommonService, SqlLiteService, documentId) {
    'ngInject'

    $log.info('DocumentPreviewDialogController', documentId);

    $scope.documentUnit8array = null;

    $scope.documentLoadPromise = SqlLiteService.loadDocumentById(documentId);
        $scope.documentLoadPromise.then((document) => {
            $scope.documentUnit8array = document.buffer;

            let currentBlob = new Blob([document.buffer], {type: 'application/pdf'});
            $scope.pdfUrl = $sce.trustAsResourceUrl(URL.createObjectURL(currentBlob));
        }).catch((error) => {
            console.log(error);
            CommonService.showToast("error", "can't load preview document");
        });
    $scope.onProgress = function (progressData) {
        console.log(progressData);
    };

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
};

module.exports = DocumentPreviewDialogController;
