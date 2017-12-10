'use strict';

function SkDropdownMenuDirective($mdMenu) {
    'ngInject';
    return {
        restrict: 'E',
        scope: {
          title: '@' 
        },
        link: (scope, element) => {
        },
        replace: true,
        templateUrl: 'common/directives/sk-dropdown-menu.html'
    }
}

export default SkDropdownMenuDirective;

