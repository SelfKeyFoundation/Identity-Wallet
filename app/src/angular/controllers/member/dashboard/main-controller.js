function MemberDashboardMainController($rootScope, $scope, $interval, $log, $q, $timeout, $mdSidenav, $state, $filter, CommonService, ElectronService, WalletService, SqlLiteService) {
    'ngInject'

    $log.info('MemberDashboardMainController',$rootScope.wallet);

    $scope.openEtherscanTxWindow = (event) => {
        $rootScope.openInBrowser("https://etherscan.io/address/0x" + $rootScope.wallet.getPublicKeyHex(), true);
    }

    $rootScope.totalBalanceInUsd = 0;
    let pieChartIsReady = false;

    
    let wallet = $rootScope.wallet;
    $scope.transactionsHistoryList = [];

    $scope.setTransactionsHistory = () => {
        SqlLiteService.getTransactionsHistoryByWalletId(wallet.id).then((data)=> {
            $scope.transactionsHistoryList = data ? $rootScope.wallet.processTransactionsHistory(data) : [];
        }).catch((err) => {
            console.log(err);
            //TODO
        });
    };

    $scope.setTransactionsHistory();

    $scope.transactionsHistoryIsSynced = () => {
        let statuses = $rootScope.transactionHistorySyncStatuses;
        let isInProgress = false;
        if (statuses) {
            Object.keys(statuses).forEach(key => {
                if (statuses[key] == false) {
                    isInProgress = true;
                }
            });
        }
        return !isInProgress;
    }
  
    // TODO
    return;

    function getTotalBalanceInUsd() {
        return Number($rootScope.wallet.balanceInUsd) + Number($rootScope.primaryToken.balanceInUsd);
    }

    /**
     * init pie chart
     */
    $scope.pieChart = {
        totalTitle: 'Tolal value USD',
        total: $rootScope.wallet.getTotalBalanceInUsd(),
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
                $log.info("clicked", item);
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
    $scope.publicKeyHex = $rootScope.wallet.getPublicKeyHex();

   
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

module.exports = MemberDashboardMainController;
