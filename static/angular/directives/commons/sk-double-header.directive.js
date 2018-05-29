'use strict';

function SkDoubleHeaderDirective($log) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            header: '@',
            subHeader: '@'
        },
        link: (scope, element) => {

        },
        replace: true,
        templateUrl: 'common/directives/sk-double-header.html'
    }
}

module.exports = SkDoubleHeaderDirective;
