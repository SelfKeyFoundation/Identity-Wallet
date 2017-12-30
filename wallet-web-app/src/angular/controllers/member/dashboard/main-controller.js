function MemberDashboardMainController($rootScope, $scope, $interval, $log, $q, $timeout, $mdSidenav, $state, $filter, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberDashboardMainController');

    let pieChartIsReady = false;
    let pieChartUpdateQueue = [];

    /**
     * init pie chart
     */
    $scope.pieChart = {
        totalTitle: 'Tolal value USD',
        total: $filter('number')($rootScope.totalBalanceInUsd),
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
            onReady: () => {
                // TODO set listenere on balance change here
                pieChartIsReady = true;
                if (pieChartUpdateQueue.length > 0) {
                    updatePieChart();
                    pieChartUpdateQueue = [];
                }
            },
            onItemClick: (item) => {
                console.log("clicked", item);
            }
        },
        actions: {}
    };

    function updatePieChart() {
        $rootScope.totalBalanceInUsd = Number($rootScope.wallet.balanceInUsd) + Number($rootScope.primaryToken.balanceInUsd);

        $scope.pieChart.total = $filter('number')($rootScope.totalBalanceInUsd);

        $scope.pieChart.items[0].value = Number($rootScope.wallet.balanceEth);
        $scope.pieChart.items[0].valueUSD = Number($rootScope.wallet.balanceInUsd);

        $scope.pieChart.items[1].value = Number($rootScope.primaryToken.getBalanceDecimal());
        $scope.pieChart.items[1].valueUSD = Number($rootScope.primaryToken.balanceInUsd);

        $scope.pieChart.draw();
    }

    /**
     * update pie chart on balance change
     */
    $rootScope.$on('balance:change', (event, symbol, value, valueInUsd) => {
        if (!pieChartIsReady) {
            pieChartUpdateQueue.push(new Date().getTime());
        } else {
            updatePieChart();
        }
    });

    $log.info("pie chart data:", $scope.pieChart);
};

export default MemberDashboardMainController;