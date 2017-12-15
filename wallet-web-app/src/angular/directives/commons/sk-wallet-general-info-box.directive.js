'use strict';

function SkWalletGeneralInfoBoxDirective($log, $window) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {
            
        },
        replace: true,
        templateUrl: 'common/directives/wallet/sk-wallet-general-info-box.html'
    }
}

export default SkWalletGeneralInfoBoxDirective;