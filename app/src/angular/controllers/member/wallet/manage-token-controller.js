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
            $scope.balance = Number($rootScope.wallet.balanceEth);
            $scope.balanceUsd = CommonService.numbersAfterComma($rootScope.wallet.balanceInUsd, 2);
        } else {
            // TOKEN
            $scope.balance = $scope.selectedToken.getBalanceDecimal();
            $scope.balanceUsd = CommonService.numbersAfterComma($scope.selectedToken.balanceInUsd, 2);
        }
    }

    $scope.loadTransactionHistory = () => {
        let tokenId = $scope.symbol.toUpperCase() === 'ETH' ? null : $scope.selectedToken.id;
        let query = {
            walletId: $rootScope.wallet.id,
            tokenId:  tokenId
        };
        SqlLiteService.getTransactionsHistoryByWalletIdAndTokenId(query).then((data)=> {
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
