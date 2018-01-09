function GuestKeystoreCreateStep4Controller($rootScope, $scope, $log, $q, $timeout, $state, $window, ConfigFileService, WalletService, ElectronService, CommonService) {
    'ngInject'

    $log.info("GuestKeystoreCreateStep4Controller", $rootScope.wallet);

    let messagesContainer = angular.element(document.getElementById("message-container"));

    $scope.privateKey = "0x" + $rootScope.wallet.getPrivateKeyHex();

    $scope.printPaperWallet = (event) => {
        $window.print();
    }

    $scope.nextStep = (event) => {

        // go to view private key
        $state.go('member.setup.choose');
    }
};

export default GuestKeystoreCreateStep4Controller;