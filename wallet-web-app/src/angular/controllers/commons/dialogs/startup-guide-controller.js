function StartupGuideDialogController($rootScope, $scope, $log, $q, $mdDialog) {
    'ngInject'

    $log.info('StartupGuideDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

};

export default StartupGuideDialogController;