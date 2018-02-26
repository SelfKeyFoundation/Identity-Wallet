'use strict';

const IdAttribute = requireAppModule('angular/classes/id-attribute');
const IdAttributeItem = requireAppModule('angular/classes/id-attribute-item');

function GuestKeystoreCreateStep4Controller($rootScope, $scope, $log, $q, $timeout, $state, $window, $stateParams, SqlLiteService, WalletService, CommonService) {
    'ngInject'

    $log.info("GuestKeystoreCreateStep4Controller", $stateParams);

    $scope.passwordStrength = 0;

    $scope.input = {
        password: ''
    };

    $scope.nextStep = (event) => {
        if ($scope.input.password === $stateParams.thePassword) {
            createKeystore();
        } else {
            CommonService.showToast('error', 'wrong confirmation password');
        }
    }

    $scope.previousStep = (event) => {
        $state.go('guest.create.step-3', { basicInfo: $stateParams.basicInfo });
    }

    function createKeystore() {
        let promise = WalletService.createKeystoreFile($scope.input.password, $stateParams.basicInfo);
        promise.then((wallet) => {
            SqlLiteService.loadWallets().then(()=>{
                $rootScope.wallet = wallet;
                $rootScope.wallet.loadIdAttributes().then((idAttributes)=>{
                    $state.go('guest.create.step-5');
                });
            });

        }).catch((error) => {
            // TODO proper message
            $log.error(error);
            CommonService.showToast('error', 'Error');
        });
    }
};

module.exports = GuestKeystoreCreateStep4Controller;
