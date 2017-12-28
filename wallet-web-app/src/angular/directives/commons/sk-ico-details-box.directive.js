'use strict';

function SkIcoDetailsBoxDirective($rootScope, $log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            type: "=",
            ico: '=',
            kycInfo: "="
        },
        link: (scope, element) => {
            scope.type = scope.type || 'requirements';

            scope.kycRequirementsCallback = {
                onReady: (error, requirementsList, progress) => {
                    let missing = false;
                    for(let i in progress){
                        if(!progress[i] || !progress[i].value){
                            missing = true;
                            break;
                        }
                    }
                    if(!missing){
                        $rootScope.$broadcast('ico:requirements-ready', scope.ico, scope.kycInfo);
                    }
                }
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-ico-details-box.html'
    }
}

export default SkIcoDetailsBoxDirective;