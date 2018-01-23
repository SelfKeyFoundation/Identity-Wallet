'use strict';

function CountdownDirective($interval) {
    'ngInject';

    return {
        restrict: 'A',
        scope: {
            countdown: '@'
        },
        link: (scope, element) => {
            let future = new Date(scope.countdown);
            
            const dhms = (t) => {
                let days = Math.floor(t / 86400);
                t -= days * 86400;
                let hours = Math.floor(t / 3600) % 24;
                t -= hours * 3600;
                let minutes = Math.floor(t / 60) % 60;
                t -= minutes * 60;
                let seconds = Math.floor(t % 60);
                return {
                    date: {
                        days: days,
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                    },
                    text: [ days + 'd', hours + 'h', minutes + 'm', seconds + 's' ].join(' ')
                }
            }

            const calculate = () => {
                let diff = Math.floor (future.getTime() - new Date().getTime()) / 1000;
                element.text(dhms(diff).text);
            }

            calculate();
            $interval(calculate, 1000);
        }
    }
}

module.exports = CountdownDirective;

