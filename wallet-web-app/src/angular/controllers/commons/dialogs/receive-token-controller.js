function ReceiveTokenDialogController($rootScope, $scope, $log, $q, $mdDialog, args) {
    'ngInject'

    $scope.symbol = args.symbol;                            // key
    $scope.publicKeyHex = "0x" + args.publicKeyHex;         // 0x4ac0d9ebd28118cab68a64ad8eb8c07c0120ebf8

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
};

export default ReceiveTokenDialogController;