'use strict';

function SkRemindersBoxDirective($log, $window) {
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
                text: "Zilliqa Sale Starts Tomorrow",
                type: "reminder"
            },
            {
                month: "DEC",
                day: "11",
                text: "Zilliqa Sale Starts Tomorrow",
                type: "notification"
            }]
        },
        replace: true,
        templateUrl: 'common/directives/sk-reminders-box.html'
    }
}

export default SkRemindersBoxDirective;