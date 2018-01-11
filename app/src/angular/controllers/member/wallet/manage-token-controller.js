function ManageTokenController($rootScope, $scope,$state, $log, $mdDialog, $stateParams, TokenService, Web3Service, CommonService) {
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


    if ($scope.symbol === 'ETH') {
        $scope.balance = $rootScope.wallet.balanceEth;
        // ETHER
    } else {
        // TOKEN
        let promise = $scope.selectedToken.loadBalance();
        promise.then((token) => {
            $scope.balance = token.getBalanceDecimal();
        });
    }


    $scope.balanceUsd = CommonService.numbersAfterComma(($scope.balance * $rootScope.ethUsdPrice), 2);

    $scope.goToDashboard = () => {
        $state.go('member.dashboard.main');
    }
};

export default ManageTokenController;