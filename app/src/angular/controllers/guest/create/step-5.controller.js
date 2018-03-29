'use strict';

function GuestKeystoreCreateStep5Controller($rootScope, $scope, $log, $state, $stateParams, $mdDialog, $timeout, SqlLiteService, RPCService, CommonService, SelfkeyService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep5Controller');

    $scope.createBasicId = (event) => {
        $state.go('guest.create.step-6');
    }

    $scope.importKycFile = (event) => {
        RPCService.makeCall('importKYCPackage', { walletId: $rootScope.wallet.id }).then((walletSetting) => {
            SelfkeyService.triggerAirdrop(walletSetting.airDropCode).then(()=>{
                SqlLiteService.removeAirdropCode();
            });

            $rootScope.wallet.loadIdAttributes().then(() => {
                $state.go('guest.create.step-6', {type: 'kyc_import'});
            })
        }).catch((error) => {
            CommonService.showToast('error', 'Error');
        });
    }


};

module.exports = GuestKeystoreCreateStep5Controller;
