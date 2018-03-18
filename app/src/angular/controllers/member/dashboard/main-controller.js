'use strict';

function MemberDashboardMainController($rootScope, $scope, $interval, $log, $q, $timeout, $mdSidenav, $state, $filter, CommonService, SqlLiteService) {
    'ngInject'

    $log.info('MemberDashboardMainController', $rootScope.wallet);

    $scope.openEtherscanTxWindow = (event) => {
        $rootScope.openInBrowser("https://etherscan.io/address/0x" + $rootScope.wallet.getPublicKeyHex(), true);
    }

    let pieChartIsReady = false;

    let wallet = $rootScope.wallet;
    $scope.transactionsHistoryList = [];

    $scope.setTransactionsHistory = () => {
        SqlLiteService.getTransactionsHistoryByWalletId(wallet.id).then((data) => {
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

    $rootScope.CUSTOM_TOKENS_LIMIT = 20;
    let processCustomTokens = () => {
        let tokensCnt = Object.keys(wallet.tokens).length + 1; // +1 for ETH
        $rootScope.tokenLimitIsExceed = tokensCnt >= $rootScope.CUSTOM_TOKENS_LIMIT;
    };

    processCustomTokens();

    $scope.totalBalanceInUsd = wallet.calculateTotalBalanceInUSD();

    $scope.getPieChartItems = () => {
        let pieChartItems = [];
        Object.keys(wallet.tokens).forEach((tokeyKey) => {
            let pieChartItem = {};
            let token = wallet.tokens[tokeyKey];

            let tokenPrice = SqlLiteService.getTokenPriceBySymbol(token.symbol.toUpperCase());
            if (tokenPrice) {
                pieChartItem.title = tokenPrice.name;
                pieChartItem.valueUSD = Number(CommonService.numbersAfterComma(token.getBalanceInUsd(), 2));
            } else {
                pieChartItem.title = 'Unknown';
                pieChartItem.valueUSD = 0;
            }

            pieChartItem.subTitle = token.symbol;

            pieChartItems.push(pieChartItem);
        });

        let ethPrice = SqlLiteService.getTokenPriceBySymbol('ETH');
        pieChartItems.unshift({
            subTitle: 'ETH',
            title: 'Ethereum',
            valueUSD: Number(CommonService.numbersAfterComma(wallet.getBalanceInUsd(), 2))
        });

        return pieChartItems;

    };

    $scope.pieChart = {
        totalTitle: 'Total value USD',
        total: CommonService.numbersAfterComma(wallet.calculateTotalBalanceInUSD(), 2),
        items: $scope.getPieChartItems(),
        callback: {
            onReady: () => {
                // TODO set listenere on balance change here
                pieChartIsReady = true;
                if (wallet.calculateTotalBalanceInUSD() > 0) {
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
        processCustomTokens();
        $scope.pieChart.items = $scope.getPieChartItems();

        $scope.totalBalanceInUsd = wallet.calculateTotalBalanceInUSD();
        $scope.pieChart.total = CommonService.numbersAfterComma($scope.totalBalanceInUsd, 2);
        $scope.pieChart.draw();
    }

    /**
     * update pie chart on balance change
     */
    $rootScope.$on('balance:change', (event, symbol, value, valueInUsd) => {
        if (pieChartIsReady) {
            updatePieChart();
        }
    });

    /**
     * update pie chart on balance change
     */
    $rootScope.$on('piechart:reload', (event) => {
        if (pieChartIsReady) {
            updatePieChart();
        }
    });

    $log.info("pie chart data:", $scope.pieChart);
};

module.exports = MemberDashboardMainController;
