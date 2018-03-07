'use strict';

function AddEditStaticDataDialogController($rootScope, $scope, $log, $q, $mdDialog, SqlLiteService, idAttributeItemValue, idAttributeType, CommonService) {
    'ngInject'

    $log.info('AddEditStaticDataDialogController', idAttributeItemValue, idAttributeType);

    const INITIAL_ID_ATTRIBUTES = ['first_name', 'last_name', 'middle_name', 'country_of_residency', 'id_selfie', 'national_id', 'email'];
    const ADDRESS_ID_ATTRIBUTES = ['physical_address', 'work_place'];
    const COUNTRY_ID_ATTRIBUTES = ['nationality', 'country_of_residency'];
    const DATE_ID_ATTRIBUTES = ['birthdate'];

    $scope.idAttributeItemValue = idAttributeItemValue;
    $scope.idAttributeType = idAttributeType;
    $scope.countryList = SqlLiteService.getCountries();
    $scope.singleInputType = "text";

    if(idAttributeType === 'email'){
        $scope.singleInputType = 'email';
    }

    $scope.theForm = null;

    $scope.inputs = {
        staticData: angular.copy(idAttributeItemValue.staticData)
    }

    $scope.close = (event) => {
        $mdDialog.cancel();
    };

    $scope.isFormInvalid = (theForm) => {
        $scope.theForm = theForm;
        if(!$scope.theForm.$valid) return true;

        return false;
    }

    $scope.getFormPath = () => {
        if(ADDRESS_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1){
            return 'common/dialogs/id-attributes/forms/address.html';
        } else if (COUNTRY_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
            return 'common/dialogs/id-attributes/forms/country.html';
        } else if (DATE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
            return 'common/dialogs/id-attributes/forms/birth-date.html';
        } else {
            return 'common/dialogs/id-attributes/forms/static-data.html';
        }
    }

    $scope.save = (event, theForm) => {

        if($scope.isFormInvalid(theForm)) return;

        let value = {
            id: idAttributeItemValue.id
        }

        $scope.savePromise = null;

        if(ADDRESS_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1){
            value.staticData = $scope.inputs.address1;
        } else if (COUNTRY_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
            value.staticData = $scope.inputs.country;
        } else if (DATE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
            value.staticData = $scope.inputs.date.getTime()
        } else {
            value.staticData = $scope.inputs.staticData
        }

        $scope.savePromise = SqlLiteService.updateIdAttributeItemValueStaticData(value);

        $scope.savePromise.then((data) => {
            $mdDialog.hide($scope.inputs);
        }).catch((error) => {
            CommonService.showToast('error', 'error');
        });
    }

    $scope.showErrorToast = (input) => {
        if (input.length == 0) {
            CommonService.showToast('error', 'This field is required. Please enter ' + $scope.idAttributeType);
        }
    };
};

module.exports = AddEditStaticDataDialogController;
