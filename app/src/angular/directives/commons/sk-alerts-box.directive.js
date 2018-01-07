'use strict';

function SkAlertsBoxDirective($log, $window) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            title: '@'
        },
        link: (scope, element) => {
            // TODO type
            scope.data = [{ 
                icon: "notification",
                month: "DEC",
                date: "11.10.15",
                text: "sometexx t1111",
                type: "warning",
                action: "Proof of Address Required!"
            },
            {
                icon: "wallet",
                month: "DEC",
                date: "11.01.18",
                text: "some text22222",
                type: "warning",
                action: "Proof of Address Required!"
            }]
        },
        replace: true,
        templateUrl: 'common/directives/sk-alerts-box.html'
    }
}

export default SkAlertsBoxDirective;