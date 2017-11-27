function GuestUnlockKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, CommonService) {
    'ngInject'

    $log.info('GuestUnlockKeystoreController');
    let messagesContainer = angular.element(document.getElementById("message-container"));
    $scope.keystorePassword = "";

    $scope.unlock = (event) => {
        $scope.unlockPromise = WalletService.unlockKeystoreObject($scope.keystorePassword);
        $scope.unlockPromise.then((wallet) => {
            if (wallet.privateKeyHex) {
                // go to private key details page
                $state.go('member.setup.view-keystore');
            }else{
                CommonService.showMessage({
                    container: messagesContainer,
                    type: "info",
                    message: "incorrect password",
                    closeAfter: 2000
                });
            }
        }).catch((error) => {
            CommonService.showMessage({
                container: messagesContainer,
                type: "info",
                message: "incorrect password",
                closeAfter: 2000
            });
        });
    }

    //$scope.walletsMetaData = ConfigFileService.getWalletsMetaData();

};

export default GuestUnlockKeystoreController;