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

            if(scope.symbol !== 'eth'){
                console.log($rootScope.TOKEN_MAP, "<<<<")
                scope.token = $rootScope.TOKEN_MAP[scope.symbol.toUpperCase()];
                let promise = scope.token.loadBalanceFor(scope.publicKeyHex);
                promise.then((token) => {
                    scope.balance = new BigNumber(token.balanceDecimal).div(new BigNumber(10).pow(scope.token.decimal)).toString();
                    scope.balanceInUsd = calculateBalanceInUsd(scope.balance, tempPricePerUnit[scope.symbol]);
                });

                /*
                // test
                let a = WalletService.generateTokenRawTransaction(
                    "0x4e7776ce0510778f44e8d43fa2d4d13b5d3930d5",
                    10000,
                    35000000000,
                    250000,
                    "qey"
                )

                console.log(a, "<<<<<<<<");
                */
            }else{
                scope.balance = $rootScope.wallet.balanceEth;
                scope.balanceInUsd = calculateBalanceInUsd(scope.balance, tempPricePerUnit[scope.symbol]);
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

                if(successful){
                    scope.isJustCopied = true;

                    $timeout(()=>{
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
            
            

            function calculateBalanceInUsd (balance, pricePerUnit) {
                balance = (Number(balance) * Number(pricePerUnit));
                if(balance > 0){
                    return CommonService.numbersAfterComma(balance, 2);                
                } else {
                    return 0;
                }
            }

        },
        replace: true,
        templateUrl: 'common/directives/sk-token-box.html'
    }
}

export default SkTokenBoxDirective;