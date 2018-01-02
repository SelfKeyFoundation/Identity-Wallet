function TermsDialogController($rootScope, $scope, $log, $q, $mdDialog, ElectronService, ConfigFileService) {
    'ngInject'

    $log.info('TermsDialogController');
    $scope.storeSavePromise = null;
    $scope.step = 'main'
    $scope.scrolledBottom = false;

    $scope.changeStep = (step) => {
        $scope.step = step;
    }

    $scope.agree = (event) => {
        let store = ConfigFileService.getStore();
        store.setup = store.setup || {};
        store.setup.termsAccepted = true;
        $scope.storeSavePromise = ConfigFileService.save();
        $scope.storeSavePromise.then(() => {
            $mdDialog.hide();
        });
    };

    $scope.notAgree = (event) => {
        $rootScope.closeApp();
    };

    $scope.scrollToEndContainer = (direction) => {
        if(direction === 'bottom'){
            $scope.scrolledBottom = true;
            $scope.$apply()
        }
    }
};

export default TermsDialogController;