'use strict';
function SkCustomBoxDirective($rootScope, $log, $window, $timeout, CommonService, WalletService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            name: '@',
            text: '@'
        },
        link: (scope, element) => {

        },
        replace: true,
        templateUrl: 'common/directives/sk-custom-token-box.html'
    }
}

module.exports = SkCustomBoxDirective;
