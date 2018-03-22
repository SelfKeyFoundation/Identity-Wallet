'use strict';

function SkUserInfoBoxDirective($rootScope, $log, $window, $timeout, $filter, SqlLiteService) {
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

            let idAttributeTypes = SqlLiteService.getIdAttributeTypes();

            scope.idAttributes = {};
            prepareData();

            scope.$on('sk-user-info-box:update', () => {
                prepareData();
            });

            scope.openDocumentAddEditModal = (event, idAttribute) => {
                let idAttributes = $rootScope.wallet.getIdAttributes();
                $rootScope.$broadcast('id-attribute:open-document-add-dialog', idAttributes[idAttribute.key].items[0].values[0], idAttribute.key);
            }

            scope.getItemValue = (item) => {
                if(item.type === 'document' && item.documentFileName){
                    return 'Uploaded';
                }

                switch(item.key){
                    case 'birthdate':
                        return $filter('date')(Number(item.staticData.line1), 'yyyy/MM/dd');
                        break;
                    case 'work_place':
                    case 'physical_address':
                        let value = item.staticData.line1 + ", ";

                        if(item.staticData.line2){
                            value += item.staticData.line2 + ", ";
                        }

                        value += item.staticData.line3 + ", ";
                        value += item.staticData.line4 + ", ";
                        value += item.staticData.line5 + ", ";
                        value += item.staticData.line6;

                        return value
                        break;
                    case 'phonenumber_countrycode':
                        return item.staticData.line1 + " " + item.staticData.line2
                        break;
                    default:
                        return item.staticData.line1
                }
            }

            function prepareData() {
                scope.idAttributes = {};

                let idAttributes = $rootScope.wallet.getIdAttributes();


                for (let i in idAttributes) {
                    scope.idAttributes[i] = {
                        key: i,
                        type: idAttributeTypes[i].type,
                        staticData: idAttributes[i].items[0].values[0].staticData,
                        documentFileName: idAttributes[i].items[0].values[0].documentFileName
                    }
                }
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-user-info-box.html'
    }
}

module.exports = SkUserInfoBoxDirective;
