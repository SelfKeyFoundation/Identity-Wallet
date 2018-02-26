const IdAttribute = requireAppModule('angular/classes/id-attribute');
const IdAttributeItem = requireAppModule('angular/classes/id-attribute-item');

function GuestKeystoreCreateStep6Controller($rootScope, $scope, $log, $q, $timeout, $state, $window, $stateParams, WalletService) {
    'ngInject'

    $log.info("GuestKeystoreCreateStep6Controller");

    $scope.privateKey = "0x" + $rootScope.wallet.getPrivateKeyHex();

    $scope.printPaperWallet = (event) => {
        $window.print();
    }

    $scope.nextStep = (event) => {
        $state.go('member.setup.checklist');
    }
};

module.exports = GuestKeystoreCreateStep6Controller;