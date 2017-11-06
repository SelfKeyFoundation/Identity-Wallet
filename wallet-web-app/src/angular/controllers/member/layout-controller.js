function MemberLayoutController($rootScope, $scope, $log, $mdDialog, ElectronService, ConfigStorageService, CommonService) {
    'ngInject'

    $log.info('MemberLayoutController');

    if (!ConfigStorageService.APP_OPEN_COUNT || ConfigStorageService.APP_OPEN_COUNT === 0) {
        var promise = CommonService.openUserAgreementDialog(true);
        promise.then(() => {
            if (!ConfigStorageService.USER_DOCUMENTS_STORAGE_PATH && ElectronService.ipcRenderer) {
                CommonService.openChooseUserDirectoryDialog(false);
            }
        });
    }

    ConfigStorageService.APP_OPEN_COUNT++;
    ConfigStorageService.setAppOpenCount(ConfigStorageService.APP_OPEN_COUNT);
};

export default MemberLayoutController;