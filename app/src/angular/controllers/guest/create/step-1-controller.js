'use strict';

function GuestKeystoreCreateStep1Controller($rootScope, $scope, $log, $state) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep1Controller');

    $scope.createBasicId = (event) => {
        $state.go('guest.create.step-2');
    }
};

module.exports = GuestKeystoreCreateStep1Controller;
