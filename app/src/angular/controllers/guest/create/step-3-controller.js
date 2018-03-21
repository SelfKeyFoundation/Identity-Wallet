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
            return CommonService.showToast('warning', 'Password is required.');
        }
        $state.go('guest.create.step-4', { thePassword: $scope.input.password, basicInfo: $stateParams.basicInfo });
    }

    $scope.getPasswordStrengthInfo = () => {
        if(!$scope.input.password || !$scope.input.password.length){
            return 'Please create a new password.';
        }

        if($scope.passwordStrength && $scope.passwordStrength.score){
            return $scope.passwordStrength.score > 2 ? 'Strong' : 'Weak';
        } else {
            return 'Weak';
        }
    }
};

module.exports = GuestKeystoreCreateStep3Controller;
