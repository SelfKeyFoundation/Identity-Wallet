"use strict";

function SkIcoItemBoxDirective($log, $window, $timeout) {
	"ngInject";

    return {
        restrict: 'E',
        scope: {
            icoData: "=",
        },
        link: (scope, element) => {

        },
        replace: true,
        templateUrl: 'common/directives/sk-ico-item-box.html'
    }
}

module.exports = SkIcoItemBoxDirective;
