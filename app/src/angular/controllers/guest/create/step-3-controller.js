'use strict';

function GuestKeystoreCreateStep3Controller($rootScope, $scope, $log, $state, $stateParams, CommonService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep3Controller');

    $scope.passwordStrength = 0;

    $scope.input = {
        password: ''
    };

    $scope.nextStep = (event, form) => {
        if (!$scope.input.password) {
            return CommonService.showToast('warning', 'password is required');
        }
        $state.go('guest.create.step-4', { thePassword: $scope.input.password, basicInfo: $stateParams.basicInfo });
    }
};

module.exports = GuestKeystoreCreateStep3Controller;
