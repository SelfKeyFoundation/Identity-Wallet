function MemberLayoutController($rootScope, $scope, $log, $mdDialog, ElectronService, ConfigStorageService, CommonService, EtherscanService, EtherUnitsService) {
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

    
    let testPromise = EtherscanService.getBalance('0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb');
    testPromise.then((response) => {
        let a = EtherUnitsService.toEther(response.data.result, 'wei');
        console.log(a);
    });
};

export default MemberLayoutController;