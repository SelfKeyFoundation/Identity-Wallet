'use strict';

function SkWalletHistoryItemDirective($log, $window) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {
            scope.state = 'closed';

            scope.toggle = (event) => {
                scope.state = scope.state === 'closed' ? 'opened' : 'closed';
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-wallet-history-item.html'
    }
}

export default SkWalletHistoryItemDirective;