'use strict';

function GuestKeystoreCreateStep5Controller($rootScope, $scope, $log, $state, $stateParams, RPCService, CommonService) {
    'ngInject'

    $log.info("GuestKeystoreCreateStep5Controller", $stateParams);

    $scope.nextStep = (event) => {
        $state.go('guest.create.step-6');
    }

    $scope.backupKeystore = (event) => {
        let promise = RPCService.makeCall('openDirectorySelectDialog', null);
        promise.then((targetDirectory) => {
            if (targetDirectory) {
                RPCService.makeCall('getWalletsDirectoryPath', null).then((walletsDirectoryPath) => {
                    let walletPath = walletsDirectoryPath + "/" + $rootScope.wallet.keystoreFilePath;
                    RPCService.makeCall('moveFile', { src: walletPath, dest: targetDirectory, copy: true }).then(() => {
                        CommonService.showToast('success', 'Saved!');
                    });
                });
            }
        });
    }
};

module.exports = GuestKeystoreCreateStep5Controller;
