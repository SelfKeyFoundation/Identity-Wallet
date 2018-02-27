'use strict';

const Wallet = requireAppModule('angular/classes/wallet');


function GuestImportKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, RPCService, SqlLiteService, CommonService) {
    'ngInject'

    $log.info('GuestImportKeystoreController');

    const wallets = SqlLiteService.getWallets();

    $scope.publicKeyList = SqlLiteService.getWalletPublicKeys();
    $scope.isUnlocking = false;
    $rootScope.wallet = null;
    $scope.type = $stateParams.type;

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

        });
    }

    $scope.unlock = (event, theForm) => {
        if (!theForm.$valid) return;

        if (!$scope.userInput.password) {
            return CommonService.showToast('warning', 'password is required');;
        }

        if ($scope.type === 'select') {
            if (wallets[$scope.userInput.selectedPublicKey]) {
                let unlockExistingWalletPromise = RPCService.makeCall('unlockExistingWallet', {
                    publicKey: $scope.userInput.selectedPublicKey,
                    password: $scope.userInput.password
                });

                unlockExistingWalletPromise.then((data)=>{
                    $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);
                    let initialPromises = [];
                    initialPromises.push($rootScope.wallet.loadIdAttributes());
                    initialPromises.push($rootScope.wallet.loadTokens());

                    $q.all(initialPromises).then(()=>{
                        $state.go('member.dashboard.main');
                    });
                }).catch((error)=>{
                    console.log(error);
                    return CommonService.showToast('error', 'error');
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
                console.log(error);
                return CommonService.showToast('error', 'error');
            });
        }

        /*
        if (!selectedFilePath || !$scope.userInput.password) return;

        $scope.isUnlocking = true;
        let promise = WalletService.unlockByFilePath(wallets[$scope.userInput.selectedPublicKey].id, selectedFilePath, $scope.userInput.password);
        promise.then((wallet) => {

            let initialPromises = [];
            initialPromises.push(wallet.loadIdAttributes());
            initialPromises.push(wallet.loadTokens());

            $q.all(initialPromises).then(()=>{
                $state.go('member.dashboard.main');
            });

        }).catch((error) => {
            $log.error(error);

            theForm.password.$setValidity("badKeystore", false);
            theForm.password.$setValidity("required", false);
        }).finally(()=>{
            $scope.isUnlocking = false;
        });
        */
    }

};

module.exports = GuestImportKeystoreController;
