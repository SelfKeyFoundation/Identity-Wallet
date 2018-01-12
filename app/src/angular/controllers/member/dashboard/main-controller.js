function MemberDashboardMainController($rootScope, $scope, $interval, $log, $q, $timeout, $mdSidenav, $state, $filter, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberDashboardMainController');

    $rootScope.totalBalanceInUsd = 0;
    let pieChartIsReady = false;

    function getTotalBalanceInUsd() {
        return Number($rootScope.wallet.balanceInUsd) + Number($rootScope.primaryToken.balanceInUsd);
    }
   
    /*

    {
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
    }

    */


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
                if (getTotalBalanceInUsd() > 0) {
                    updatePieChart();
                }
            },
            onItemClick: (item) => {
                console.log("clicked", item);
            }
        },
        actions: {}
    };

    function updatePieChart() {
        $rootScope.totalBalanceInUsd = getTotalBalanceInUsd();
        $scope.pieChart.total = $filter('number')($rootScope.totalBalanceInUsd);

        $scope.pieChart.items[0].value = Number($rootScope.wallet.balanceEth);
        $scope.pieChart.items[0].valueUSD = Number($rootScope.wallet.balanceInUsd);

        $scope.pieChart.items[1].value = Number($rootScope.primaryToken.getBalanceDecimal());
        $scope.pieChart.items[1].valueUSD = Number($rootScope.primaryToken.balanceInUsd);

        $scope.pieChart.draw();
    }

    function updateTokenBalance (token) {
        for(let i in $scope.pieChart.items){
            let item = $scope.pieChart.items[i];

            if(item.subTitle === token){
                
            }
        }
    }

    /**
     * update pie chart on balance change
     */
    $rootScope.$on('balance:change', (event, symbol, value, valueInUsd) => {
        if (pieChartIsReady) {
            updatePieChart();
        } 
    });

    $log.info("pie chart data:", $scope.pieChart);
};

export default MemberDashboardMainController;