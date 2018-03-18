'use strict';

function UpdateDialogController($rootScope, $scope, $log, $q, $mdDialog, releaseName) {
    'ngInject'

    $log.info('UpdateDialogController', releaseName);
    $scope.updatePromise = null;

    $scope.releaseName = releaseName;

    $scope.close = (event) => {
        $mdDialog.hide();
    };

    $scope.update = (event) => {
        /*
        $scope.updatePromise = ElectronService.installUpdate();
        $scope.updatePromise.then(() => {
            $mdDialog.hide();
        });
        */
    };
};

module.exports = UpdateDialogController;
