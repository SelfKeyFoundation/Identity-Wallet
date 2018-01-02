'use strict';

function SkRightNavDirective($log, $q, $window, $timeout, $interval, $state) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            control: "="
        },
        link: (scope, element) => {
            if(!scope.control) {
                scope.control = {};
            }

            scope.control.state = 'closed';

            scope.control.open = () => {
                let defer = $q.defer();
                
                element.removeClass('display-none');

                scope.control.state = 'is-opening';
                defer.resolve(); // TEMP

                return defer.promise;
            }

            scope.getSelectedClass = (state) => {
                if($state.current.name.indexOf(state) !== -1) {
                    return "sk-right-sidenav__section__item__selected";
                }
            }

            scope.close = () => {
                scope.control.state = 'is-closing';
                $timeout(()=>{
                    element.addClass('display-none');
                }, 1500);
                // hide element
                //element.remove();
            }

            scope.$on('$destroy', () => {
                
            });
        },
        replace: true,
        templateUrl: 'common/directives/sk-right-sidenav.html'
    }
}

export default SkRightNavDirective;