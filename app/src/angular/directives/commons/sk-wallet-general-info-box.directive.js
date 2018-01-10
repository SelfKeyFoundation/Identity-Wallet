'use strict';

function SkWalletGeneralInfoBoxDirective($log, $window, ConfigFileService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {
            let store = ConfigFileService.getStore();
            
        },
        replace: true,
        templateUrl: 'common/directives/sk-wallet-general-info-box.html'
    }
}

export default SkWalletGeneralInfoBoxDirective;