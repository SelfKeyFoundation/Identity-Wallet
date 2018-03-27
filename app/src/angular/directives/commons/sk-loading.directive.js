'use strict';

function SkLoadingDirective($log) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            header: '=',
            subHeader: '='
        },
        link: (scope, element) => {
            
        },
        replace: true,
        templateUrl: 'common/directives/sk-loading.html'
    }
}

module.exports = SkLoadingDirective;
