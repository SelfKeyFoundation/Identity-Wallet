'use strict';

function SkWalletDocumentBoxDirective($log, $window) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {
            
        },
        replace: true,
        templateUrl: 'common/directives/sk-wallet-document-box.html'
    }
}

export default SkWalletDocumentBoxDirective;