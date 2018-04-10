'use strict';

function keyPressDirective($document) {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            $document.bind("keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.keyPress);
                    });
                    event.preventDefault();
                }
            });
        }
    }
}

module.exports = keyPressDirective;
