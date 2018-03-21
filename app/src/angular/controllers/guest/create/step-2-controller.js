'use strict';

function GuestKeystoreCreateStep2Controller($rootScope, $scope, $log, $state, $mdDialog, SqlLiteService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep2Controller');

    $scope.countryList = SqlLiteService.getCountries();

    $scope.input = {
        first_name: "",
        last_name: "",
        middle_name: "",
        country_of_residency: ""
    };

    $scope.nextStep = (event, form) => {
        if (!form.$valid) return;
        $state.go('guest.create.step-3', { basicInfo: $scope.input });
    }
};

module.exports = GuestKeystoreCreateStep2Controller;
