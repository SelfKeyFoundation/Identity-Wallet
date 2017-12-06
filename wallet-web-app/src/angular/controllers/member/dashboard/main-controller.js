function MemberDashboardMainController($rootScope, $scope, $log, $q, $timeout, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberDashboardMainController');
    
    EtherScanService.getBalance($rootScope.wallet.getAddress()).then((balance)=>{
        console.log(">>>>", balance);
    });
  
};

export default MemberDashboardMainController;