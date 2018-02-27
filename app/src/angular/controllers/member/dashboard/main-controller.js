function MemberDashboardMainController($rootScope, $scope, $interval, $log, $q, $timeout, $mdSidenav, $state, $filter, CommonService, ElectronService, WalletService) {
    'ngInject'

    $log.info('MemberDashboardMainController',$rootScope.wallet);
    debugger;

    $scope.openEtherscanTxWindow = (event) => {
        $rootScope.openInBrowser("https://etherscan.io/address/0x" + $rootScope.wallet.getPublicKeyHex(), true);
    }

    $rootScope.totalBalanceInUsd = 0;
    let pieChartIsReady = false;

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
    $scope.transactionActivityIsSynced = function () {
        let statuses = $rootScope.walletActivityStatuses;
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

    $scope.transactionsHistoryList =  SqlLiteService.getTransactionsHistory();

    /*
    $scope.setTransactionAtivity = () => {
        let store = ConfigFileService.getStore();

        let data = store.wallets[$scope.publicKeyHex].data;
        let allTransactions = [];
        if (data.activities) {
            Object.keys(data.activities).forEach(activityKey => {
                let activity = data.activities[activityKey];
                let transactions = activity && activity.transactions ? activity.transactions : [];
                transactions.forEach(transaction => {
                    if (transaction.to) {
                        transaction.nameOfTo = WalletService.getWalletName(activityKey, transaction.to);
                    }
                    let symbol = activityKey.toUpperCase();
                    transaction.sentOrReceive = transaction.to ? 'Sent' : 'Received';
                    transaction.symbol = symbol;

                });
                allTransactions = allTransactions.concat(transactions);
            });

            allTransactions.sort((a, b) => {
                return Number(b.timestamp) - Number(a.timestamp);
            });

            $scope.allTransactions = allTransactions;
        }
    }
    $scope.setTransactionAtivity();
    */
   
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
