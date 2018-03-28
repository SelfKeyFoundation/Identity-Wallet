'use strict';

function GuestKeystoreCreateStep1Controller($rootScope, $scope, $log, $state, $timeout, $stateParams, $mdDialog, CommonService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep1Controller');

    $scope.passwordStrength = 0;
    $scope.input = {
        password: $stateParams.thePassword || ''
    };

    $scope.nextStep = (event, form) => {
        if (!$scope.input.password) {
            return CommonService.showToast('warning', 'Password is required.');
        }
        $state.go('guest.create.step-2', { thePassword: $scope.input.password });
    }

    $scope.getPasswordStrengthInfo = () => {
        if(!$scope.input.password || !$scope.input.password.length){
            return '';
        }

        if($scope.passwordStrength && $scope.passwordStrength.score){
            return $scope.passwordStrength.score > 2 ? 'Strong' : 'Weak';
        } else {
            return 'Weak';
        }
    }
    $timeout(() => {
        if (!$stateParams.thePassword) {
            $mdDialog.show({
                controller: 'PasswordWarningDialogController',
                templateUrl: 'common/dialogs/password-warning.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: false,
                fullscreen: true
            });
        }
    }, 200);
};

module.exports = GuestKeystoreCreateStep1Controller;
