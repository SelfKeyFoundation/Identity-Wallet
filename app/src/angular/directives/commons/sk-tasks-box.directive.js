'use strict';

function SkTasksBoxDirective($log) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            date: '@',
            completed: '@',
            outstanding: "@",
            upcoming: "@"
        },
        link: (scope, element) => {
            scope.completedInPercent = 0;
            
            scope.total = scope.outstanding + scope.upcoming; // TODO
            scope.percent = Math.floor(scope.completed / scope.total * 100);
            console.log(">>>>", scope.percent, scope.total, scope.completed);
        },
        replace: true,
        templateUrl: 'common/directives/sk-tasks-box.html'
    }
}

module.exports = SkTasksBoxDirective;