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
            if(data.id){
                $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey);

                if (data.isSetupFinished) {
                    $state.go('member.dashboard.main');
                } else {
                    $state.go('guest.create.step-3', { walletData: data });
                }
            }else{
                CommonService.showToast('warning', 'missing implementation');
            }
        }).catch((error) => {
            $log.error(error);
            theForm.privateKey.$setValidity("badPrivateKey", false);
            $scope.isUnlocking = false;
        });
    }

};

module.exports = GuestImportPrivateKeyController;
