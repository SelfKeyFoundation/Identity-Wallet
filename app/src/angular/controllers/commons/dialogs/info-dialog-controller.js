function InfoDialogController($rootScope, $scope, $log, $mdDialog,form) {
    'ngInject'

    $scope.form = form;
    $log.info('form - ',$scope.form);

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
};

module.exports = InfoDialogController;
