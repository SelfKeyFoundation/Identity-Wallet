function UserDocumentsStoragePathDialog ($rootScope, $scope, $log, $mdDialog, CONFIG, ElectronService, ConfigStorageService) {
    'ngInject'

    $log.info('UserDocumentsStoragePathDialog');

    const EVENTS = CONFIG.constants.events;

    $scope.currentDirectory = ConfigStorageService.USER_DOCUMENTS_STORAGE_PATH;

    $scope.chooseDirectory = (event) => {
        ElectronService.openUsersDocumentDirectoryChangeDialog(event);
    };

    $scope.cancel = function (event) {
        $mdDialog.cancel();
    }

    ElectronService.ipcRenderer.on(EVENTS.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE, (event, path) => {
        $log.debug(EVENTS.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE, path);
        $scope.currentDirectory = path;
        ConfigStorageService.setUserDocumentsStoragePath(path);
        $scope.$apply();
    });

};

export default UserDocumentsStoragePathDialog;
