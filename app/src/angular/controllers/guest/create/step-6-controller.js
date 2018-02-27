'use strict';

function GuestKeystoreCreateStep6Controller($rootScope, $scope, $log, $state, $window, $stateParams) {
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
