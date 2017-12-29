'use strict';

import BigNumber from 'bignumber.js';

function SkTokenBoxDirective($rootScope, $log, $window, $timeout, CommonService, WalletService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            symbol: '@'
        },
        link: (scope, element) => {

            let tempPricePerUnit = {
                'eth': 875,
                'qey': 0.015,
                'key': 0.015
            }

            scope.token = null;
            scope.balance = 0;
            scope.balanceInUsd = 0;
            scope.title = $rootScope.getTranslation("token", scope.symbol.toUpperCase());
            scope.publicKeyHex = '0x' + $rootScope.wallet.getPublicKeyHex();

            if (scope.symbol !== 'eth') {
                scope.token = $rootScope.TOKEN_MAP[scope.symbol.toUpperCase()];
                let promise = scope.token.loadBalance();
                promise.then((token) => {
                    scope.balance = token.getBalanceDecimal();
                    scope.balanceInUsd = token.balanceInUsd;
                    console.log("??????", scope.balanceInUsd);
                });


                // test --- generating good tx
                /*
                let a = WalletService.generateTokenRawTransaction(
                    "0x4e7776ce0510778f44e8d43fa2d4d13b5d3930d5",
                    10000,
                    35000000000,
                    150000,
                    "QEY"
                )
                console.log(a, "<<<<<<<<");
                */


            } else {
                scope.balance = $rootScope.wallet.balanceEth;
                let promise = $rootScope.wallet.loadBalance();
                promise.then(() => {
                    scope.balanceInUsd = $rootScope.wallet.balanceInUsd;
                });
            }

            scope.isJustCopied = false;

            scope.copy = (event) => {
                let el = angular.element(event.target);
                let selection = $window.getSelection();
                let range = document.createRange();
                range.selectNodeContents(el[0]);
                selection.removeAllRanges();
                selection.addRange(range);

                let successful = document.execCommand('copy');
                selection.removeAllRanges();

                if (successful) {
                    scope.isJustCopied = true;

                    $timeout(() => {
                        scope.isJustCopied = false;
                    }, 1000);
                }
            }

            /**
             * 1: get & translate name
             * 2: load balance
             * 3: load value in usd
             * 4: update global common map with new value
             * 5: watch on value 
             */

        },
        replace: true,
        templateUrl: 'common/directives/sk-token-box.html'
    }
}

export default SkTokenBoxDirective;