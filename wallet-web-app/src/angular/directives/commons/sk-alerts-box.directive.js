'use strict';

function SkAlertsBoxDirective($log, $window) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            
        },
        link: (scope, element) => {
            // TODO type
            scope.data = [{
                month: "DEC",
                day: "11",
                text: "Action Required  Zilliqa Token Sale:",
                type: "warning",
                action: "Proof of Address Required!"
            },
            {
                month: "DEC",
                day: "11",
                text: "Action Required  Zilliqa Token Sale:",
                type: "warning",
                action: "Proof of Address Required!"
            }]
        },
        replace: true,
        templateUrl: 'common/directives/sk-alerts-box.html'
    }
}

export default SkAlertsBoxDirective;