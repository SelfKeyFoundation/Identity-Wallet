'use strict';

function SkUserInfoBoxDirective($log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            title: '@',
            icon: '@',
            userData: "=",
        },
        link: (scope, element) => {
        },
        replace: true,
        templateUrl: 'common/directives/sk-user-info-box.html'
    }
}

export default SkUserInfoBoxDirective;