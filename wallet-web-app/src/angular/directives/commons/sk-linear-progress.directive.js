'use strict';

function SkLinearProgressDirective() {
    'ngInject';
    return {
        restrict: 'E',
        scope: {
            maxValue: '@',
            value: '@' 
        },
        link: (scope, element) => {
            var progressPercent = null;
            scope.isLoop = scope.maxValue && scope.value
            if (scope.isLoop) {
                scope.progressPercent = scope.value*100/scope.maxValue + '%';
            } 
        },
        replace: true,
        templateUrl: 'common/directives/sk-linear-progress.html'
    }
}

export default SkLinearProgressDirective;

