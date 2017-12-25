function AddCustomTokenDialogController($rootScope, $scope, $log, $q, $mdDialog) {
    'ngInject'

    $log.info('AddCustomTokenDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

};

export default AddCustomTokenDialogController;