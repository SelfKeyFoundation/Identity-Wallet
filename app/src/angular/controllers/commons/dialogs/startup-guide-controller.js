'use strict';

function StartupGuideDialogController($rootScope, $scope, $log, $q, $mdDialog, $state, $transitions, SqlLiteService) {
    'ngInject'

    $log.info('StartupGuideDialogController');

    $scope.isLoading = false;

    let guideSettings = SqlLiteService.getGuideSettings();
    guideSettings.guideShown = true;

    SqlLiteService.saveGuideSettings(guideSettings);

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.goToWalletSetup = () => {
        $scope.isLoading = true;
        $mdDialog.hide();
    }
};

module.exports = StartupGuideDialogController;
