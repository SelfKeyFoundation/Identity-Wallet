'use strict';

function skShowLoading($compile) {
    'ngInject';

    var eventHandler = function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
    };


    return {
        restrict: 'A',
        scope: {
            skShowLoading: '='
        },
        link: (scope, element, attr) => {
            var innerHTML = angular.copy(element.html());
            scope.$watch('skShowLoading', function (newVal, oldVal) {
                if (newVal == 0) {
                    element.html('<div class="loading">Loading<span>.</span><span>.</span><span>.</span></div>');
                    element.css('color', '#0dc7dd');
                    element.prop('disabled', true);
                    element.on('click', eventHandler);
                } else {
                    element.prop('disabled', false);
                    element.off('click', eventHandler);
                    element.html(innerHTML);
                    $compile(element.contents())(scope);
                }
            }, true);


        }
    }
}

export default skShowLoading;