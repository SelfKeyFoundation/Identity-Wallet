function MemberDashboardMainController($rootScope, $scope, $log, $q, $timeout, $mdSidenav, $state, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberDashboardMainController');

    $scope.tempEthUsd = CommonService.numbersAfterComma(($rootScope.wallet.balanceEth * 615), 2);
    $scope.tempKeysNum = 20000;
    $scope.tempKeyUsd = CommonService.numbersAfterComma(($scope.tempKeysNum * 0.015), 2);

    $scope.pieChartData = {
        total: Number($scope.tempEthUsd) + Number($scope.tempKeyUsd),
        totalTitle: 'Tolal value USD',
        items: [{
            title: 'Ethereum',
            subTitle: 'eth',
            value: Number($scope.tempEthUsd),
            color: '#9c27b0',
            icon: 'eth'
        }, {
            title: 'Selfkey',
            subTitle: 'key',
            icon: 'key',
            value: Number($scope.tempKeyUsd),
            color: '#0dc7dd'
        }],
        callback: {
            onItemClick: (item) => {
                console.log("clicked", item);
            }
        }
    };

    $log.info("pie chart data:", $scope.pieChartData);

};

export default MemberDashboardMainController;