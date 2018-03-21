'use strict';

function GuestKeystoreCreateStep1Controller($rootScope, $scope, $log, $state, $stateParams, $mdDialog, $timeout) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep1Controller');

    $timeout(()=>{
        if(!$stateParams.type){
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
    }, 200)


    $scope.createBasicId = (event) => {
        $state.go('guest.create.step-2');
    }
};

module.exports = GuestKeystoreCreateStep1Controller;
