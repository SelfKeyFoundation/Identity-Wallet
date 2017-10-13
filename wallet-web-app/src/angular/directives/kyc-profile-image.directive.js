'use strict';

function KycProfileImageDirective($log) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            imageUrl: '@',
            mode: '@'
        },
        link: (scope, element) => {
            scope.randomClassSuffix = Math.floor(Math.random() * 1000000);
            scope.profileImageClass = "profile-image-" + scope.randomClassSuffix;
            
            if(!scope.mode) {
                scope.mode = 'toolbar';
            }
        },
        templateUrl: 'common/directives/kyc-profile-image.html'
    }
}

export default KycProfileImageDirective;

