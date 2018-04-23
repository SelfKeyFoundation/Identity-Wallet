'use strict';

function ConnectingToLedgerDialogController($rootScope, $scope, $log, $mdDialog) {
    'ngInject'

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
};

module.exports = ConnectingToLedgerDialogController;
