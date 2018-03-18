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

        $mdDialog.show({
            controller: 'PasswordWarningDialogController',
            templateUrl: 'common/dialogs/password-warning.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                basicInfo: $scope.input
            }
        });
    }
};

module.exports = GuestKeystoreCreateStep2Controller;
