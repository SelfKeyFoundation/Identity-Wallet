'use strict';

function SkIcoDetailsBoxDirective($log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {
            
        },
        replace: true,
        templateUrl: 'common/directives/sk-ico-details-box.html'
    }
}

export default SkIcoDetailsBoxDirective;