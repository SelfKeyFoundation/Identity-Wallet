'use strict';
function SkTokenBoxDirective($rootScope, $log, $window, $timeout, CommonService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            symbol: '@'
        },
        link: (scope, element) => {

            scope.item = scope.symbol.toUpperCase() === 'ETH' ? $rootScope.wallet : $rootScope.wallet.tokens[scope.symbol.toUpperCase()];


            scope.token = null;
            scope.balance = 0;
            scope.balanceInUsd = 0;

            scope.title = $rootScope.getTranslation("token", scope.symbol.toUpperCase());
            scope.publicKeyHex = '0x' + $rootScope.wallet.getPublicKeyHex();

            loadBalance();

            function loadBalance() {
                if (scope.symbol !== 'eth') {
                    scope.token = $rootScope.wallet.tokens[scope.symbol.toUpperCase()];
                    scope.balance = scope.token.getBalanceDecimal();
                    scope.balanceInUsd = scope.token.balanceInUsd;
                    /*
                    let promise = scope.token.loadBalance();
                    promise.then((token) => {
                        scope.balance = scope.token.getBalanceDecimal();
                        scope.balanceInUsd = scope.token.balanceInUsd;
                    });
                    */
                } else {
                    scope.balance = $rootScope.wallet.balanceEth;
                    scope.balanceInUsd = $rootScope.wallet.balanceInUsd;
                    /*
                    let promise = $rootScope.wallet.loadBalance();
                    promise.then(() => {
                        scope.balance = $rootScope.wallet.balanceEth;
                        scope.balanceInUsd = $rootScope.wallet.balanceInUsd;
                    });
                    */
                }
            }

            function updateBalanceInfo() {
                if (scope.symbol !== 'eth') {
                    scope.balance = scope.token.getBalanceDecimal();
                    scope.balanceInUsd = scope.token.balanceInUsd;
                } else {
                    scope.balance = $rootScope.wallet.balanceEth;
                    scope.balanceInUsd = $rootScope.wallet.balanceInUsd;
                }
            }

            $rootScope.$on('balance:change', (event, symbol, value, valueInUsd) => {
                updateBalanceInfo();
            });
        },
        replace: true,
        templateUrl: 'common/directives/sk-token-box.html'
    }
}

module.exports = SkTokenBoxDirective;
