'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function PasswordWarningDialogController($rootScope, $scope, $log, $q, $mdDialog, $state, $transitions, RPCService, CommonService, basicInfo, SqlLiteService) {
    'ngInject'

    $log.info('PasswordWarningDialogController');

    $scope.isLoading = false;

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.accept = (event) => {
        $mdDialog.hide();
    }

    $transitions.onStart({ }, function(trans) {
        trans.promise.finally(()=>{
            $mdDialog.hide();
            $scope.isLoading = false;
        });
    });
};

module.exports = PasswordWarningDialogController;
