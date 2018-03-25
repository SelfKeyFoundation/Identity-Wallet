'use strict';

function GuestKeystoreCreateStep5Controller($rootScope, $scope, $log, $state, $stateParams, $mdDialog, $timeout, RPCService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep5Controller');

    $scope.createBasicId = (event) => {
        $state.go('guest.create.step-6');
    }

    $scope.importKycFile = (event) => {
        RPCService.makeCall('importKYCPackage', {}).then(()=>{
            console.log(">>>>>>>>>>>>>>");
        }).catch((error)=>{

        });
    }
    //
};

module.exports = GuestKeystoreCreateStep5Controller;
