'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function PasswordWarningDialogController($rootScope, $scope, $log, $q, $mdDialog, $state, RPCService, CommonService, SqlLiteService) {
    'ngInject'

    $log.info('PasswordWarningDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.accept = (event) => {
        $mdDialog.hide();
    }
};

module.exports = PasswordWarningDialogController;
