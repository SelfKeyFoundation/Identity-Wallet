function ReceiveTokenDialogController($rootScope, $scope, $log, $q, $mdDialog) {
    'ngInject'


    $scope.publicKey = '0x4ac0d9ebd28118cab68a64ad8eb8c07c0120ebf8'

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
};

export default ReceiveTokenDialogController;