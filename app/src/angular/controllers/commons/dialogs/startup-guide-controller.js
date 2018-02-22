function StartupGuideDialogController($rootScope, $scope, $log, $q, $mdDialog, $state, SqlLiteService) {
    'ngInject'

    $log.info('StartupGuideDialogController');

    let guideSettings = SqlLiteService.getGuideSettings();
    guideSettings.guideShown = true;

    SqlLiteService.saveGuideSettings(guideSettings);

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.goToWalletSetup = () => {
        $state.go('guest.welcome');
        $mdDialog.hide();
    }
};

module.exports = StartupGuideDialogController;
