'use strict';

function SkButtonLoadingDirective($log, $compile) {
    'ngInject';

    return {
        restrict: "A",
        priority: 1,
        scope: {
            skButtonLoading: "="
        },
        link: {
            pre: function (scope, elem, attr) {

                scope.isProcessing = false;

                function onClick(e) {
                    if (scope.isProcessing) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        console.log("11111")
                        return false;
                    } else {
                        console.log("22222")
                        return true;
                    }
                }

                elem.on('click', onClick);
                scope.$on('$destroy', function () {
                    elem.off('click', onClick);
                });
            },
            post: function (scope, elem, attr) {
                var innerHtml = angular.copy(elem.html());

                scope.$watch("skButtonLoading", function (newValue, oldValue) {
                    console.log("3333", newValue, typeof newValue)
                    if (newValue === null || newValue === undefined) return;

                    console.log("4444", typeof newValue)

                    if (typeof newValue === "boolean") {
                        console.log("5555")
                        if (newValue) {
                            elem.html('Please Wait...');
                            elem.attr('disabled', 'disabled');
                            scope.isProcessing = true;
                        } else {
                            elem.html(innerHtml);
                            elem.removeAttr("disabled");
                            scope.isProcessing = false;
                            $compile(elem.contents())(scope);
                        }
                    } else if (typeof newValue == 'number') {
                        console.log("66666")
                        switch (newValue) {
                            case 0:
                                elem.html('Please Wait...');
                                elem.attr('disabled', 'disabled');
                                scope.isProcessing = true;
                                console.log("777777")
                                break;
                            default:
                                elem.html(innerHtml);
                                elem.removeAttr("disabled");
                                scope.isProcessing = false;
                                $compile(elem.contents())(scope);
                                console.log("88888")
                        }
                    }
                }, true);
            }
        }
    };
}

module.exports = SkButtonLoadingDirective;
