function UserDocumentsStoragePathDialog ($rootScope, $scope, $log, $mdDialog, CONFIG, ElectronService) {
    'ngInject'

    $log.info('UserDocumentsStoragePathDialog');

    const EVENTS = CONFIG.constants.events;

    $scope.chooseDirectory = (event) => {
        ElectronService.openUsersDocumentDirectoryChangeDialog(event);
    };

    ElectronService.ipcRenderer.on(EVENTS.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE, (event, path) => {
        console.log("?????", path);
    });

};

export default UserDocumentsStoragePathDialog;
