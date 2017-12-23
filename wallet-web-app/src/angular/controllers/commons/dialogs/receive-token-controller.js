function ReceiveTokenDialogController($rootScope, $scope, $log, $q, $mdDialog) {
    'ngInject'

    $log.info('ReceiveTokenDialogController');



    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

};

export default ReceiveTokenDialogController;