function ManageTokenController($rootScope, $scope, $log, $mdDialog, $stateParams, TokenService, Web3Service, CommonService) {
    'ngInject'

    $log.info("ManageTokenController", $stateParams)

    let temporaryMap = {
        "key": "Selfkey",
        "qey": "Selfkey",
        "eth": "Ethereum"
    }

    $scope.selectedToken = TokenService.getBySymbol($stateParams.id.toUpperCase());

    $scope.publicKeyHex = $rootScope.wallet.getAddress();
    $scope.symbol = $stateParams.id.toUpperCase();
    $scope.name = temporaryMap[$scope.symbol];
    
    $scope.balance = 0;


    if ($scope.symbol === 'ETH') {
        $scope.balance = $rootScope.wallet.balanceEth;
    } else {
        let promise = $scope.selectedToken.loadBalanceFor($scope.publicKeyHex);
        promise.then((token) => {
            $scope.balance = token.balanceDecimal;
        });
    }

    $scope.balanceUsd = CommonService.numbersAfterComma(($scope.balance * $rootScope.ethUsdPrice), 2);

};

export default ManageTokenController;