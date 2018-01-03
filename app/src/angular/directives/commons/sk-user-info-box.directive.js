'use strict';

function SkUserInfoBoxDirective($rootScope, $log, $window, $timeout, ConfigFileService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {},
        link: (scope, element) => {
            scope.userData = {
                email: "",
                name: "",
                country_of_residency: "",
                tempImage: 'assets/images/temp/avatar.jpg'
            }

            let store = ConfigFileService.getStore();
            let idAttributes = store.idAttributes;

            reloadData ();

            function reloadData(){
                for(let i in idAttributes){
                    let item = idAttributes[i];
                    scope.userData[i] = item.items[item.defaultItemId].value;
                }    
            }
            
            $rootScope.$on('id-attributes-changed', (event) => {
                reloadData();
            });
        },
        replace: true,
        templateUrl: 'common/directives/sk-user-info-box.html'
    }
}

export default SkUserInfoBoxDirective;