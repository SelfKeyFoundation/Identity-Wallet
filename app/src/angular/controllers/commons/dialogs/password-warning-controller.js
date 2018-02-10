function PasswordWarningDialogController($rootScope, $scope, $log, $mdDialog, $state, basicInfo) {
    'ngInject'

    $log.info('PasswordWarningDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.accept = (event) => {
        $state.go('guest.create.step-3', {basicInfo: basicInfo});
        $mdDialog.hide();
    }
};

module.exports = PasswordWarningDialogController;