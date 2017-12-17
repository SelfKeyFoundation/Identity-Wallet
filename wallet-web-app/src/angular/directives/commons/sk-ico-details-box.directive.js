'use strict';

function SkIcoDetailsBoxDirective($log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element) => {
            scope.requirementsFirstPart = [];
            scope.requirementsSecondPart = [];
            if (scope.data && scope.data.type === 'requirements' && scope.data.requirementsList) {
                scope.requirementsFirstPart = scope.data.requirementsList.splice(0,  scope.data.requirementsList.length / 2);
                scope.requirementsSecondPart = scope.data.requirementsList;
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-ico-details-box.html'
    }
}

export default SkIcoDetailsBoxDirective;