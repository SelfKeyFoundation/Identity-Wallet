'use strict';

function SkKycRequirementsBoxDirective($log, $window) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            progress: "=",
            sections: "="
        },
        link: (scope, element) => {
            
        },
        replace: true,
        templateUrl: 'common/directives/sk-kyc-requirements-box.html'
    }
}

export default SkKycRequirementsBoxDirective;