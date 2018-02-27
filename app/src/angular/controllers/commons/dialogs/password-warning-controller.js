'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function PasswordWarningDialogController($rootScope, $scope, $log, $q, $mdDialog, $state, RPCService, CommonService, basicInfo) {
    'ngInject'

    $log.info('PasswordWarningDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.accept = (event) => {
        if($rootScope.walletImportData){
            let promise = RPCService.makeCall('importAndUnlockExistingWallet', {
                keystoreFilePath: $rootScope.walletImportData.keystoreFilePath,
                publicKey: $rootScope.walletImportData.publicKey,
                password: $rootScope.walletImportData.password,
                initialIdAttributesValues: basicInfo
            });

            promise.then((data)=>{
                $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);
                let initialPromises = [];
                initialPromises.push($rootScope.wallet.loadIdAttributes());
                initialPromises.push($rootScope.wallet.loadTokens());

                $q.all(initialPromises).then(()=>{
                    $rootScope.walletImportData = null;
                    $state.go('member.setup.checklist');
                    $mdDialog.hide();
                });
            }).catch((error)=>{
                return CommonService.showToast('error', 'error');
            });
        }else{
            $state.go('guest.create.step-3', { basicInfo: basicInfo });
            $mdDialog.hide();
        }
    }
};

module.exports = PasswordWarningDialogController;
