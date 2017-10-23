function MemberLayoutController($rootScope, $scope, $log, $mdDialog, ElectronService, ConfigStorageService) {
    'ngInject'

    $log.info('MemberLayoutController', ConfigStorageService, ElectronService);

    /**
     * 
     */
    $scope.$on('on-local-storage-change', (event, data) => {
        $log.info('on-local-storage-change', data);

        if (ElectronService.ipcRenderer) {
            ElectronService.sendConfigChange(data);
        }
    });

    if (!ConfigStorageService.APP_OPEN_COUNT || ConfigStorageService.APP_OPEN_COUNT === 0) {
        $mdDialog.show({
            templateUrl: 'common/dialogs/legal-tems-and-conditions.html',
            controller: "LegalTermsAndConditionsDialog",
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: false
        }).then(() => {
            if (!ConfigStorageService.USER_DOCUMENTS_STORAGE_PATH && ElectronService.ipcRenderer) {
                $mdDialog.show({
                    templateUrl: 'common/dialogs/user-documents-storage-path.html',
                    controller: 'UserDocumentsStoragePathDialog',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    fullscreen: false
                });
            }
        });
    }

    ConfigStorageService.APP_OPEN_COUNT++;
    ConfigStorageService.setAppOpenCount(ConfigStorageService.APP_OPEN_COUNT);
};

export default MemberLayoutController;