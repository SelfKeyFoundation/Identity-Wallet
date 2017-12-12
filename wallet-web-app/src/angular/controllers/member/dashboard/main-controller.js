function MemberDashboardMainController($rootScope, $scope, $log, $q, $timeout, $mdSidenav, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberDashboardMainController');

    EtherScanService.getBalance($rootScope.wallet.getAddress()).then((balance) => {
        console.log(">>>>", balance);
    });

    $timeout(() => {
        $mdSidenav('right').toggle().then(function () {
            $log.debug("toggle " + navID + " is done");
        });
    }, 2000);

};

export default MemberDashboardMainController;