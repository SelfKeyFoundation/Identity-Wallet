'use strict';

function SkIcoItemBoxDirective($log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            title: '@',
            icon: '@',
            icoData: "=",
        },
        link: (scope, element) => {
            
        },
        replace: true,
        templateUrl: 'common/directives/sk-ico-item-box.html'
    }
}

export default SkIcoItemBoxDirective;