'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function GuestKeystoreCreateStep2Controller($rootScope, $scope, $log, $q, $state, $stateParams, SqlLiteService, RPCService, CommonService) {
    'ngInject'

    $log.info("GuestKeystoreCreateStep2Controller", $stateParams);

    $scope.walletCreationPromise = null;
    $scope.passwordStrength = 0;

    $scope.input = {
        password: ''
    };

    $scope.nextStep = (event) => {
        if ($scope.input.password === $stateParams.thePassword) {
            $scope.walletCreationPromise = createKeystore();

            $scope.walletCreationPromise.then(() => {
                $state.go('guest.create.step-3');
            }).catch((error) => {
                $log.error(error);
                CommonService.showToast('error', 'Error creating wallet');
            });
        } else {
            CommonService.showToast('error', 'Wrong confirmation password.');
        }
    }

    $scope.previousStep = (event) => {
        $state.go('guest.create.step-3');
    }

    $scope.getPasswordStrengthInfo = () => {
        if(!$scope.input.password || !$scope.input.password.length){
            return 'Please create a new password.';
        }

        if($scope.passwordStrength && $scope.passwordStrength.score){
            return $scope.passwordStrength.score > 2 ? 'Strong' : 'Weak';
        }else {
            return 'Weak';
        }
    }

    function createKeystore() {
        let defer = $q.defer();

        let promise = RPCService.makeCall('createKeystoreFile', { password: $scope.input.password });

        promise.then((data) => {
            $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);
            defer.resolve();

            /*
            SqlLiteService.loadWallets().then(() => {
                let promises = [];
                promises.push($rootScope.wallet.loadIdAttributes());
                promises.push($rootScope.wallet.loadTokens());

                $q.all(promises).then((responses) => {
                    SqlLiteService.registerActionLog("Created Attribute: First Name", "Created");
                    SqlLiteService.registerActionLog("Created Attribute: Last Name", "Created");
                    if($stateParams.basicInfo.middle_name){
                        SqlLiteService.registerActionLog("Created Attribute: Middle Name", "Created");
                    }
                    SqlLiteService.registerActionLog("Created Attribute: Country Of Residence", "Created");
                    defer.resolve();
                }).catch((error) => {
                    defer.reject(error);
                });
            }).catch((error) => {
                defer.reject(error);
            });
            */

        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }
};

module.exports = GuestKeystoreCreateStep2Controller;
