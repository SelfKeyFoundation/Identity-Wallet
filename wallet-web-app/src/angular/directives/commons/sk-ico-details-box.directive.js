'use strict';

function SkIcoDetailsBoxDirective($log, $window, $timeout) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            type: "=",
            progress: "=",
            sections: "=",
            ico: '='
        },
        link: (scope, element) => {
            scope.type = scope.type || 'requirements';

            console.log(">>>>>>", scope.type, "<<<<<<");
        },
        replace: true,
        templateUrl: 'common/directives/sk-ico-details-box.html'
    }
}

export default SkIcoDetailsBoxDirective;