'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function PasswordWarningDialogController($rootScope, $scope, $log, $q, $mdDialog, $state, $timeout, RPCService, CommonService, basicInfo) {
    'ngInject'

    $log.info('PasswordWarningDialogController');

    $scope.importAndUnlockExistingWalletPromise = null;
    $scope.isLoading = false;

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.accept = (event) => {
        if ($rootScope.walletImportData) {
            $scope.isLoading = true;
            $scope.importAndUnlockExistingWalletPromise = importAndUnlockExistingWallet()
            $scope.importAndUnlockExistingWalletPromise.then(() => {
                $rootScope.walletImportData = null;
                $state.go('member.setup.checklist');

                // Temporary
                $timeout(() => {
                    $mdDialog.hide();
                }, 6000);
            }).catch((error) => {
                if (error.code && error.code == "SQLITE_CONSTRAINT") {
                    CommonService.showToast('error', 'That Wallet already imported');
                } else {
                    CommonService.showToast('error', 'error');
                }
                $scope.isLoading = false;
            });
        } else {
            $state.go('guest.create.step-3', { basicInfo: basicInfo });
            $mdDialog.hide();
        }
    }

    function importAndUnlockExistingWallet() {
        let defer = $q.defer();

        let promise = RPCService.makeCall('importAndUnlockExistingWallet', {
            keystoreFilePath: $rootScope.walletImportData.keystoreFilePath,
            publicKey: $rootScope.walletImportData.publicKey,
            privateKey: $rootScope.walletImportData.privateKey,
            password: $rootScope.walletImportData.password,
            initialIdAttributesValues: basicInfo
        });

        promise.then((data) => {
            $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);
            let initialPromises = [];
            initialPromises.push($rootScope.wallet.loadIdAttributes());
            initialPromises.push($rootScope.wallet.loadTokens());

            $q.all(initialPromises).then((resp) => {
                defer.resolve();
            }).catch((error) => {
                defer.reject(error);
            });
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }
};

module.exports = PasswordWarningDialogController;
