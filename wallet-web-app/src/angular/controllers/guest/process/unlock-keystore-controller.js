function GuestUnlockKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, $mdDialog, ConfigFileService, WalletService, CommonService) {
    'ngInject'

    $log.info('GuestUnlockKeystoreController');
    let messagesContainer = angular.element(document.getElementById("message-container"));

    $scope.ready = true;
    $scope.keystorePassword = "";
    $scope.selectedPublicKey = $rootScope.wallet.getAddress();
    $scope.publicKeys = ConfigFileService.getWalletPublicKeys();

    $scope.changeWallet = () => {
        $log.info($scope.selectedPublicKey);
        $scope.ready = false;
        let wmd = ConfigFileService.getWalletsMetaDataByPublicKey($scope.selectedPublicKey);

        WalletService.importUsingKeystoreFilePath(wmd.keystoreFilePath).then((wallet) => {
            $rootScope.wallet = wallet;
            $scope.ready = true;
        }).catch((error)=>{
            $log.error(error)
        });
    }

    $scope.unlock = (event) => {
        if(!$scope.ready) return;

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
                    closeAfter: 2000,
                    replace: true
                });
            }
        }).catch((error) => {
            CommonService.showMessage({
                container: messagesContainer,
                type: "info",
                message: "incorrect password",
                closeAfter: 2000,
                replace: true
            });
        });
    }


    // $timeout(()=>{
    //     $mdDialog.show({
    //         controller: 'TermsDialogController',
    //         templateUrl: 'common/dialogs/terms.html',
    //         parent: angular.element(document.body),
    //         targetEvent: null,
    //         clickOutsideToClose: false,
    //         fullscreen: true,
    //     })
    // }, 1000);

    //$scope.walletsMetaData = ConfigFileService.getWalletsMetaData();

};

export default GuestUnlockKeystoreController;