function MemberDashboardMainController($rootScope, $scope, $interval, $log, $q, $timeout, $mdSidenav, $state, $filter, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberDashboardMainController', $rootScope.wallet.balanceInUsd, $rootScope.primaryToken.balanceInUsd, $rootScope.wallet, $rootScope.primaryToken);

    $scope.totalBalanceInUsd = Number($rootScope.wallet.balanceInUsd) + Number($rootScope.primaryToken.balanceInUsd);

    $scope.pieChartData = {
        total: $filter('number')($scope.totalBalanceInUsd),
        totalTitle: 'Tolal value USD',
        items: [{
            title: 'Ethereum',
            subTitle: 'eth',
            value: Number($rootScope.wallet.balanceEth),
            valueUSD: Number($rootScope.wallet.balanceInUsd),
            color: '#9c27b0',
            icon: 'eth'
        }, {
            title: 'Selfkey',
            subTitle: 'key',
            icon: 'key',
            value: Number($rootScope.primaryToken.getBalanceDecimal()),
            valueUSD: Number($rootScope.primaryToken.balanceInUsd),
            color: '#0dc7dd'
        }],
        callback: {
            onItemClick: (item) => {
                console.log("clicked", item);
            }
        }
    };

    $scope.pieChartActions = {};


    $interval(()=>{
        $scope.pieChartActions.reDraw();
    }, 10000);
    

    $log.info("pie chart data:", $scope.pieChartData);
};

export default MemberDashboardMainController;