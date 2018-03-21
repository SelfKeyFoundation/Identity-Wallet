'use strict';

function CloseWarningDialogController($rootScope, $scope, $log, $mdDialog, RPCService) {
    'ngInject'

    $log.info('###CloseWarningDialogController');

    $scope.yes = (event) => {
        $rootScope.closeApp();
    };

    $scope.cancel = (event) => {
        RPCService.makeCustomCall('ON_CLOSE_DIALOG_CANCELED');
        $mdDialog.hide();
    };
};

module.exports = CloseWarningDialogController;
