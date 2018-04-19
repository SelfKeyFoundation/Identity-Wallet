function ManageTokenController($rootScope, $scope, $state, $log, $mdDialog, $stateParams, Web3Service, CommonService, SqlLiteService) {
    'ngInject'

    $log.info("ManageTokenController", $stateParams)

    let temporaryMap = {
        "key": "Selfkey",
        "eth": "Ethereum"
    }

    $scope.selectedToken = $rootScope.wallet.tokens[$stateParams.id.toUpperCase()];

    $scope.publicKeyHex = "0x" + $rootScope.wallet.getPublicKeyHex();
    $scope.symbol = $stateParams.id.toUpperCase();
    $scope.originalSymbol = $stateParams.id;
    $scope.name = temporaryMap[$scope.symbol];

    $rootScope.transactionHistorySyncStatuses = $rootScope.transactionHistorySyncStatuses || {};
    $scope.transactionsHistoryIsSynced = () => {
        return $rootScope.transactionHistorySyncStatuses[$scope.symbol.toUpperCase()];
    };

    /**
     *
     */
    prepareBalance();

    /**
     *
     */
    function prepareBalance() {
        if ($scope.symbol === 'ETH') {
            // ETHER
            let ethRoundedBalanceUSD = $rootScope.wallet.balanceInUsd > 0 ? $rootScope.wallet.balanceInUsd.toFixed(2) : $rootScope.wallet.balanceInUsd;
            let ethRoundedFormattedBalance = $rootScope.wallet.balanceEth > 0 ? $rootScope.wallet.balanceEth.toFixed(2) : $rootScope.wallet.balanceEth;

            $scope.balance = CommonService.commasAfterNumber(ethRoundedFormattedBalance, 2);
            $scope.balanceUsd = CommonService.commasAfterNumber(ethRoundedBalanceUSD, 2);
        } else {
            // TOKEN
            let roundedBalanceUSD = $scope.selectedToken.balanceInUsd > 0 ? $scope.selectedToken.balanceInUsd.toFixed(2) : $scope.selectedToken.balanceInUsd;
            let roundedFormattedBalance = Number($scope.selectedToken.getBalanceDecimal()) > 0 && !CommonService.isInt(Number($scope.selectedToken.getBalanceDecimal())) ? Number($scope.selectedToken.getBalanceDecimal()).toFixed(2) : Number($scope.selectedToken.getBalanceDecimal());
            $scope.balance = CommonService.commasAfterNumber(roundedFormattedBalance, 2);
            $scope.balanceUsd = CommonService.commasAfterNumber(roundedBalanceUSD, 2);
        }
    }

    $scope.loadTransactionHistory = () => {
        let tokenId = $scope.symbol.toUpperCase() === 'ETH' ? null : $scope.selectedToken.id;

        SqlLiteService.getTransactionsHistoryByWalletIdAndTokenId($rootScope.wallet.id, tokenId).then((data) => {
            $scope.transactionsHistoryList = data ? $rootScope.wallet.processTransactionsHistory(data) : [];
        }).catch((err) => {
            console.log(err);
            //TODO
        });
    };

    $scope.loadTransactionHistory();

    $scope.goToDashboard = () => {
        $state.go('member.dashboard.main');
    }

    /**
     * events
     */
    $rootScope.$on('balance:change', (event, symbol, balance, balanceInUsd) => {
        $log.info('balance:change', symbol, balance, balanceInUsd);
        prepareBalance();
    });
};

module.exports = ManageTokenController;
