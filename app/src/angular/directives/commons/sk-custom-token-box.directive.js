'use strict';
function SkCustomBoxDirective($rootScope, $log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {},
        link: (scope, element) => {
            scope.data = {
                name: "Custom Tokens",
                text: "Send or receive any custom Ethereum token (ERC-20)."
            };
        },
        replace: true,
        templateUrl: 'common/directives/sk-custom-token-box.html'
    }
}

module.exports = SkCustomBoxDirective;
