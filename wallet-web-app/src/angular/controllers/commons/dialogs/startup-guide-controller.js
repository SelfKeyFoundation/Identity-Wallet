function StartupGuideDialogController($rootScope, $scope, $log, $q, $mdDialog, $state, ConfigFileService) {
    'ngInject'

    $log.info('StartupGuideDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.goToWalletSetup = () => {
        let store = ConfigFileService.getStore();
        store.setup.guideShown = true;
        $scope.storeSavePromise = ConfigFileService.save();
        $scope.storeSavePromise.then(() => {
            $state.go('guest.process.create-keystore');
            $mdDialog.hide();
        });
    }

};

export default StartupGuideDialogController;