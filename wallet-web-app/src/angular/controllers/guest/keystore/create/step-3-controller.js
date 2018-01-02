function GuestKeystoreCreateStep3Controller($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, ElectronService, CommonService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep3Controller');

    let messagesContainer = angular.element(document.getElementById("message-container"));
    
    $scope.publicKey = "0x" + $rootScope.wallet.getPublicKeyHex();

    $scope.backupKeystore = (event) => {
        let promise = ElectronService.openDirectorySelectDialog();
        promise.then((directoryPath) => {
            if (directoryPath) {
                let store = ConfigFileService.getStore();
                let walletSettings = store.wallets[$rootScope.wallet.getPublicKeyHex()];

                ElectronService.moveFile(walletSettings.keystoreFilePath, directoryPath).then(()=>{
                    CommonService.showMessage({
                        container: messagesContainer,
                        type: "info",
                        message: "saved",
                        closeAfter: 1500,
                        replace: true
                    });
                });
            }
        });
    }
};

export default GuestKeystoreCreateStep3Controller;