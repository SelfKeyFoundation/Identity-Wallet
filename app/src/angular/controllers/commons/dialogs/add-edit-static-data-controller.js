'use strict';

function AddEditStaticDataDialogController($rootScope, $scope, $log, $q, $mdDialog, SqlLiteService, idAttributeItemValue, idAttributeType, CommonService) {
    'ngInject'

    $log.info('AddEditStaticDataDialogController', idAttributeItemValue, idAttributeType);

    $scope.idAttributeItemValue = idAttributeItemValue;
    $scope.idAttributeType = idAttributeType;



    $scope.input = angular.copy(idAttributeItemValue.staticData);

    $scope.close = (event) => {
        $mdDialog.cancel();
    };

    $scope.save = (event) => {
        if ($scope.input && $scope.input !== idAttributeItemValue.staticData) {
            let value = {
                id: idAttributeItemValue.id,
                staticData: $scope.input
            }

            SqlLiteService.updateIdAttributeItemValueStaticData(value).then((data) => {
                $mdDialog.hide($scope.input);
            }).catch((error) => {
                CommonService.showToast('error', 'error');
            });
        }
    }
    $scope.showErrorToast = (input) => {
        if (input.length == 0) {
            CommonService.showToast('error', 'This field is required. Please enter ' + $scope.idAttributeType);
        }
    };
};

module.exports = AddEditStaticDataDialogController;
