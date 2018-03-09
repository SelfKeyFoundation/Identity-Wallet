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
                prepareData();
            });

            function prepareData() {
                scope.idAttributes = {};
                let idAttributes = $rootScope.wallet.getIdAttributes();

                for (let i in idAttributes) {
                    scope.idAttributes[idAttributes[i].idAttributeType] = {}
                    if(idAttributes[i].items[0].values[0].staticData && idAttributes[i].items[0].values[0].staticData.line1){
                        scope.idAttributes[idAttributes[i].idAttributeType].value = idAttributes[i].items[0].values[0].staticData.line1;
                        if (idAttributes[i].items[0].values[0].staticData && idAttributes[i].items[0].values[0].staticData.line1 && idAttributes[i].idAttributeType == "birthdate") {
                            scope.idAttributes[idAttributes[i].idAttributeType].dateValueInMillis = Number(idAttributes[i].items[0].values[0].staticData.line1)
                        }
                    }else{
                        scope.idAttributes[idAttributes[i].idAttributeType].value = idAttributes[i].items[0].values[0].documentFileName;
                    }
                }
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-user-info-box.html'
    }
}

module.exports = SkUserInfoBoxDirective;
