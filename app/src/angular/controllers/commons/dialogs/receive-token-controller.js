function ReceiveTokenDialogController($rootScope, $scope, $log, $q, $mdDialog, args, $document, $window) {
    'ngInject'

    $scope.symbol = args.symbol;                            // key
    $scope.publicKeyHex = "0x" + args.publicKeyHex;         // 0x4ac0d9ebd28118cab68a64ad8eb8c07c0120ebf8

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    };

    $scope.copyEthAddress = () => {
        let copyText = $document.find("#eth-wallet-public-key");
        console.log(copyText);
        copyText.select();
        document.execCommand("Copy");
        alert("Copied the text: " + copyText.value);
    }

    $scope.firePrintEvent = () =>{
        $window.print();
    }
};

export default ReceiveTokenDialogController;