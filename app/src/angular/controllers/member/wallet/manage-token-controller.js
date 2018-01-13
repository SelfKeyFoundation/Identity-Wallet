function ManageTokenController($rootScope, $scope,$state, $log, $mdDialog, $stateParams, TokenService, Web3Service, CommonService, ConfigFileService) {
    'ngInject'

    $log.info("ManageTokenController", $stateParams)

    let temporaryMap = {
        "key": "Selfkey",
        "qey": "Selfkey",
        "eth": "Ethereum"
    }

    $scope.selectedToken = TokenService.getBySymbol($stateParams.id.toUpperCase());

    $scope.publicKeyHex = $rootScope.wallet.getPublicKeyHex();
    $scope.symbol = $stateParams.id.toUpperCase();
    $scope.name = temporaryMap[$scope.symbol];
    
    $scope.balance = 0;
    $scope.balanceUsd = 0;

    $scope.walletActivity = [];
    $scope.setWalletActivity = () => {
        let store = ConfigFileService.getStore();
        let data = store.wallets[$scope.publicKeyHex].data;
        let activities = data.activities;
        if ($scope.symbol === 'ETH' && activities && activities.eth) {
            $scope.walletActivity = activities.eth.transactions || [];
        }
    }
    if ($scope.symbol === 'ETH') {
        // ETHER
        $scope.balance = Number($rootScope.wallet.balanceEth);
        $scope.balanceUsd = CommonService.numbersAfterComma(($scope.balance * $rootScope.wallet.usdPerUnit), 2);
    } else {
        // TOKEN
        let promise = $scope.selectedToken.loadBalance();
        promise.then((token) => {
            $scope.balance = Number(token.getBalanceDecimal());
            $scope.balanceUsd = CommonService.numbersAfterComma(($scope.balance * token.usdPerUnit), 2);
        });
    }

    $scope.goToDashboard = () => {
        $state.go('member.dashboard.main');
    }
};

export default ManageTokenController;