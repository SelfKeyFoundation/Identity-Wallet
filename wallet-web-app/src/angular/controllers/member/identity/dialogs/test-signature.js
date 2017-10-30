function TestSignatureDialog($rootScope, $scope, $log, $mdDialog, ElectronService, IndexedDBService, ConfigStorageService) {
    'ngInject'

    $log.info('TestSignatureDialog');

    $scope.certificateFilePath;
    $scope.chooseCertificateFile = (event) => {
        ElectronService.openFileSelectDialog().then((path) => {
            $scope.certificateFilePath = path;
        });
    }

    $scope.inputPdfFilePath;
    $scope.chooseInputPdfFile = (event) => {
        ElectronService.openFileSelectDialog().then((path) => {
            $scope.inputPdfFilePath = path;
        });
    }

    $scope.outputPdfDirectoryPath;
    $scope.chooseOutputPdfDirectory = (event) => {
        ElectronService.openDirectorySelectDialog().then((path) => {
            $scope.outputPdfDirectoryPath = path;
        });
    }

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.save = (event) => {
        let promise = ElectronService.signPdf(
            $scope.inputPdfFilePath,
            $scope.outputPdfDirectoryPath + '/signed.pdf',
            $scope.certificateFilePath,
            $scope.certificatePassword
        );

        promise.then((response) => {
            console.log(response);
        }).catch(function(error){
            console.log(error);
        });
    }
};

export default TestSignatureDialog;
