'use strict';

function GuestKeystoreCreateStep6Controller($rootScope, $scope, $log, $state, $window, $stateParams) {
    'ngInject'

    $log.info("GuestKeystoreCreateStep6Controller");

    const SHOW_ICON = "ic_visibility_black_24px";
    const HIDE_ICON = "ic_visibility_off_black_24px";

    $scope.privateKey = "0x" + $rootScope.wallet.getPrivateKeyHex();
    $scope.visibilityIconName = SHOW_ICON;
    $scope.inputType = "password";

    $scope.printPaperWallet = (event) => {
        $window.print();
    }

    $scope.nextStep = (event) => {
        $state.go('guest.loading', {redirectTo: 'member.setup.checklist'});
        //$state.go('member.setup.checklist');
    }

    $scope.togglePrivateKeyVisibility = () => {
        $scope.visibilityIconName = $scope.visibilityIconName === SHOW_ICON ? HIDE_ICON : SHOW_ICON;
        $scope.inputType = $scope.visibilityIconName === SHOW_ICON ? 'password' : 'text';
    }
};

module.exports = GuestKeystoreCreateStep6Controller;
