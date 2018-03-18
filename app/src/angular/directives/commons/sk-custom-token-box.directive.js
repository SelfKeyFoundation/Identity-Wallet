'use strict';
function SkCustomBoxDirective($rootScope, $log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {},
        link: (scope, element) => {
            scope.data = {
                name: "Custom Tokens (ERC-20)",
                text: "Send custom erc-20 tokens from the Selfkey Identity Wallet. Before sending please add custom tokens to the management dashboard below."
            };
        },
        replace: true,
        templateUrl: 'common/directives/sk-custom-token-box.html'
    }
}

module.exports = SkCustomBoxDirective;
