function UserDocumentsStoragePathDialog ($rootScope, $scope, $log, $mdDialog, CONFIG, ElectronService, ConfigStorageService, showCancelButton) {
    'ngInject'

    $log.info('UserDocumentsStoragePathDialog', showCancelButton);

    const EVENTS = CONFIG.constants.events;

    $scope.currentDirectory = ConfigStorageService.USER_DOCUMENTS_STORAGE_PATH;
    $scope.showCancelButton = showCancelButton;

    $scope.chooseDirectory = (event) => {
        let promise = ElectronService.openDirectorySelectDialog(event);
        promise.then((filePath) => {
            $scope.currentDirectory = filePath;
        });
    };

    $scope.save = function (event) {
        ConfigStorageService.setUserDocumentsStoragePath($scope.currentDirectory);
        $mdDialog.hide();
    }

    $scope.cancel = function (event) {
        $mdDialog.cancel();
    }
};

export default UserDocumentsStoragePathDialog;
