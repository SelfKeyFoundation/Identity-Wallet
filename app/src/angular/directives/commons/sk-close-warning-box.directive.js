'use strict';

function SkCloseWarningBoxDirective($rootScope, $log, $window, RPCService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {},
        link: (scope, element) => {
            element[0].style.display = 'none';

            RPCService.on("SHOW_CLOSE_DIALOG", (event) => {
                element[0].style.display = 'flex';
            });

            scope.yes = (event) => {
                $rootScope.closeApp();
            }

            scope.cancel = (event) => {
                element[0].style.display = 'none';
                RPCService.makeCustomCall('ON_IGNORE_CLOSE_DIALOG');
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-close-warning-box.html'
    }
}

module.exports = SkCloseWarningBoxDirective;
