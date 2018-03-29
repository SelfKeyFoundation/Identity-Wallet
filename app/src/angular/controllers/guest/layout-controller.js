'use strict';

function GuestLayoutController($scope, $log, $state) {
    'ngInject'

    $log.info('GuestLayoutController');

    $scope.cancel = function (event) {
        $state.go('guest.welcome');
    }
};

module.exports = GuestLayoutController;
