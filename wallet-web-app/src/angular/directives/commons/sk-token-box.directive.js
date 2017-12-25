'use strict';

function SkTokenBoxDirective($log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            name: '@',
            symbol: '@',
            value: "@",
            valueInUsd: "@",
            address: "@"
        },
        link: (scope, element) => {
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
        },
        replace: true,
        templateUrl: 'common/directives/sk-token-box.html'
    }
}

export default SkTokenBoxDirective;