'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function GuestImportPrivateKeyController($rootScope, $scope, $log, $q, $timeout, $state, RPCService, CommonService, SqlLiteService) {
    'ngInject'

    $log.info('GuestImportPrivateKeyController');
    $rootScope.wallet = null;

    $scope.userInput = {
        privateKey: null
    }

    $scope.$watch('userInput.privateKey', (newVal, oldVal) => {
        $scope.theForm.privateKey.$setValidity("badPrivateKey", true);
    });

    $scope.isUnlocking = false;

    $scope.unlock = (event, theForm) => {
        if (!theForm.$valid) return;

        $scope.isUnlocking = true;

        let privateKey = $scope.userInput.privateKey;
        if (!$scope.userInput.privateKey.startsWith("0x")) {
            privateKey = "0x" + $scope.userInput.privateKey;
        }

        let importPromise = RPCService.makeCall('importPrivateKey', { privateKey: privateKey });
        importPromise.then((data) => {
            if (data.id) {
                $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey);


                let initialPromises = [];
                initialPromises.push($rootScope.wallet.loadIdAttributes());
                initialPromises.push($rootScope.wallet.loadTokens());

                $q.all(initialPromises).then((resp) => {
                    if (data.isSetupFinished) {
                        $state.go('member.dashboard.main');
                    } else {
                        if (data.keystoreFilePath) {
                            $state.go('guest.create.step-3', { walletData: data });
                        } else {
                            $state.go('guest.create.step-4');
                        }
                    }

                }).catch((error) => {
                    CommonService.showToast('error', 'error');
                });
            } else {
                CommonService.showToast('error', 'error');
            }
        }).catch((error) => {
            $log.error(error);
            theForm.privateKey.$setValidity("badPrivateKey", false);
            $scope.isUnlocking = false;
        });
    }

};

module.exports = GuestImportPrivateKeyController;
