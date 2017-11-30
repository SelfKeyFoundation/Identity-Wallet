'use strict';

function skShowLoading($compile) {
    'ngInject';

    return {
        restrict: 'A',
        require: '?ngClick',
        priority: -100,
        scope: {
            skShowLoading: '='
        },
        link: (scope, element, attr) => {
            let innerHTML = angular.copy(element.html());
            let isLoading = false;

            element.on('click', (event) => {
                if (isLoading) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return false;
                } else {
                    return true
                }
            });

            scope.$watch('skShowLoading', function (newVal, oldVal) {
                if (newVal == 0) {
                    isLoading = true;
                    element.html('<div class="loading">Loading<span>.</span><span>.</span><span>.</span></div>');
                    element.css('color', '#0dc7dd');
                    element.prop('disabled', true);
                } else {
                    isLoading = false;
                    element.prop('disabled', false);
                    element.html(innerHTML);
                    $compile(element.contents())(scope);
                }
            }, true);


        }
    }
}

export default skShowLoading;