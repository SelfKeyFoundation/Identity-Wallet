function MemberSetupCompletedController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, CommonService) {
    'ngInject'

    $log.info('MemberSetupCompletedController');

    let store = ConfigFileService.getStore();
    
    store.setup.icoAdsShown = true;
    ConfigFileService.save();

};

export default MemberSetupCompletedController;