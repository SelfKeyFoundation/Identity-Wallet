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
        selectedPublicKey: $scope.publicKeyList.length == 1 ? $scope.publicKeyList[0] : null,
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
            let selectedPublicKey = $scope.userInput.selectedPublicKey;
            if (!selectedPublicKey) {
                $scope.isAuthenticating = false;
                return;
            }
            if (wallets[selectedPublicKey]) {
                let promise = unlockExistingWallet(selectedPublicKey, $scope.userInput.password);
                promise.then((data) => {
                    if (data.isSetupFinished) {
                        $state.go('member.dashboard.main');
                    } else {
                        $state.go('guest.create.step-3', { walletData: data });
                    }
                }).catch((error) => {
                    $scope.isAuthenticating = false;
                    $scope.incorrectPassword = true;
                });
            }
        } else if ($scope.type === 'import') {
            let promise = RPCService.makeCall('importKeystoreFile', {
                keystoreFilePath: $rootScope.walletImportData.keystoreFilePath,
                password: $scope.userInput.password
            });

            promise.then((data) => {
                $rootScope.walletImportData = data;
                $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);

                $state.go('guest.create.step-3', { walletData: data });
            }).catch((error) => {
                $scope.isAuthenticating = false;
                CommonService.showToast('error', $rootScope.DICTIONARY[error]);
            });
        }
    }

    $transitions.onStart({}, function (trans) {
        trans.promise.finally(() => {
            $scope.isAuthenticating = false;
        });
    });

    /**
     *
     */
    function unlockExistingWallet(publicKey, password) {
        let defer = $q.defer();

        let unlockExistingWalletPromise = RPCService.makeCall('unlockKeystoreFile', {
            publicKey: publicKey,
            password: password
        });

        unlockExistingWalletPromise.then((data) => {
            $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);

            let initialPromises = [];
            initialPromises.push($rootScope.wallet.loadIdAttributes());
            initialPromises.push($rootScope.wallet.loadTokens());

            $q.all(initialPromises).then((resp) => {
                defer.resolve(data);
            }).catch((error) => {
                defer.reject(error);
            });
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    /**
     *
     */
    $scope.$on('selfkey:on-keypress', (event, key) => {
        if (key == 'Enter') {
            $scope.unlock(event, $scope.theForm);
        }
    });
};

module.exports = GuestImportKeystoreController;
