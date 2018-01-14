function ReceiveTokenDialogController($rootScope, $scope, $log, $q, $mdDialog, $window, args) {
    'ngInject'

    $scope.symbol = args.symbol;                            // key
    $scope.publicKeyHex = "0x" + args.publicKeyHex;         // 0x4ac0d9ebd28118cab68a64ad8eb8c07c0120ebf8

    $scope.print = (event) => {
        $window.print();
    }

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
};

export default ReceiveTokenDialogController;