'use strict';

function SkIcoDetailsBoxDirective($rootScope, $log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            type: "=",
            ico: '=',
            kycInfo: "=",
            config: "="
        },
        link: (scope, element) => {
            scope.type = scope.type || 'requirements';

            if (scope.ico.cap.raised && scope.ico.cap.total) {
                scope.ico.cap.remaining = scope.ico.cap.total - scope.ico.cap.raised;
            } else {
                scope.ico.cap.remaining = '';
            }

            scope.kycRequirementsCallback = {
                onReady: (error, requirementsList, missingIdAttributes, allIdAttributes) => {
                    if (Object.keys(missingIdAttributes).length <= 0) {
                        $rootScope.$broadcast('ico:requirements-ready', scope.ico, scope.kycInfo);
                    }
                }
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-ico-details-box.html'
    }
}

module.exports = SkIcoDetailsBoxDirective;
