function PasswordWarningDialogController($rootScope, $scope, $log, $mdDialog, $state) {
    'ngInject'

    $log.info('PasswordWarningDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.accept = (event) => {
        $state.go('guest.welcome');
    }
};

module.exports = PasswordWarningDialogController;