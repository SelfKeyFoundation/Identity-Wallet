'use strict';

function SkIcoBoxDirective($log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            title: '@',
            icon: '@',
            icoData: "="
        },
        link: (scope, element) => {
            
        },
        replace: true,
        templateUrl: 'common/directives/sk-ico-box.html'
    }
}

export default SkIcoBoxDirective;