'use strict';

function SkUserInfoBoxDirective($rootScope, $log, $window, $timeout) {
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

            scope.idAttributes = {};
            prepareData();

            scope.$on('sk-user-info-box:update', () => {
                console.log('sk-user-info-box:update')
                prepareData();
            });

            function prepareData () {
                scope.idAttributes = {};
                let idAttributes = $rootScope.wallet.getIdAttributes();

                for(let i in idAttributes){
                    scope.idAttributes[idAttributes[i].idAttributeType] = {}
                    scope.idAttributes[idAttributes[i].idAttributeType].value = idAttributes[i].items[0].values[0].staticData || idAttributes[i].items[0].values[0].documentFileName
                }
                console.log(" > > >> > >> > >>>>>>>", scope.idAttributes)
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-user-info-box.html'
    }
}

module.exports = SkUserInfoBoxDirective;
