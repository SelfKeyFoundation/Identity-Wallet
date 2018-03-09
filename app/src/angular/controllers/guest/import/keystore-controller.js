'use strict';

const Wallet = requireAppModule('angular/classes/wallet');


function GuestImportKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, $transitions, RPCService, SqlLiteService, CommonService) {
    'ngInject'

    $log.info('GuestImportKeystoreController');

    const wallets = SqlLiteService.getWallets();

    $scope.publicKeyList = SqlLiteService.getWalletPublicKeys();
    $scope.isUnlocking = false;
    $rootScope.wallet = null;
    $scope.type = $stateParams.type;

    $scope.isAuthenticating = false;

    $scope.userInput = {
        selectedPublicKey: $scope.publicKeyList.length > 0 ? $scope.publicKeyList[0] : null,
        selectedFilePath: null,
        password: null
    }

    $scope.selectKystoreFile = (event, theForm) => {
        let promise = RPCService.makeCall('openKeystoreFileSelectDialog');
        promise.then((data) => {
            $rootScope.walletImportData = data;
        }).catch((error) => {
            CommonService.showToast('error', 'wrong file selected');
        });
    }

    $scope.unlock = (event, theForm) => {
        if (!theForm.$valid) return;

        if (!$scope.userInput.password) {
            return CommonService.showToast('warning', 'password is required');;
        }

        $scope.isAuthenticating = true;
        if ($scope.type === 'select') {
            if (wallets[$scope.userInput.selectedPublicKey]) {
                let promise = unlockExistingWallet();
                promise.then(()=>{
                    $state.go('member.dashboard.main');
                }).catch((error)=>{
                    $scope.isAuthenticating = false;
                    CommonService.showToast('error', 'incorrect password');
                });
            }
        } else if ($scope.type === 'import'){
            let promise = RPCService.makeCall('unlockKeystoreFile', {
                keystoreFilePath: $rootScope.walletImportData.keystoreFilePath,
                password: $scope.userInput.password
            });

            promise.then((data) => {
                $rootScope.walletImportData = data;
                $state.go('guest.create.step-1');
            }).catch((error)=>{
                $scope.isAuthenticating = false;
                CommonService.showToast('error', 'incorrect password');
            });
        }
    }

    $transitions.onStart({ }, function(trans) {
        trans.promise.finally(()=>{
            $scope.isAuthenticating = false;
        });
    });

    function unlockExistingWallet(){
        let defer = $q.defer();

        let unlockExistingWalletPromise = RPCService.makeCall('unlockExistingWallet', {
            publicKey: $scope.userInput.selectedPublicKey,
            password: $scope.userInput.password
        });

        unlockExistingWalletPromise.then((data)=>{
            $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);
            let initialPromises = [];
            initialPromises.push($rootScope.wallet.loadIdAttributes());
            initialPromises.push($rootScope.wallet.loadTokens());

            $q.all(initialPromises).then((resp)=>{
                defer.resolve();
            }).catch((error)=>{
                defer.reject(error);
            });
        }).catch((error)=>{
            defer.reject(error);
        });

        return defer.promise;
    }

};

module.exports = GuestImportKeystoreController;
