function GuestKeystoreCreateStep2Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, $mdDialog, SqlLiteService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep2Controller');

    $scope.countryList = SqlLiteService.getCountries();

    $scope.input = {
        firstName: "",
        lastName: "",
        middleName: "",
        countryOfResidency: ""
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
