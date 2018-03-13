'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function PasswordWarningDialogController($rootScope, $scope, $log, $q, $mdDialog, $state, $transitions, RPCService, CommonService, basicInfo, SqlLiteService) {
    'ngInject'

    $log.info('PasswordWarningDialogController');

    $scope.isLoading = false;

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.accept = (event) => {
        if ($rootScope.walletImportData) {
            $scope.isLoading = true;
            let promise = importAndUnlockExistingWallet()
            promise.then(() => {
                $rootScope.walletImportData = null;
                $state.go('member.setup.checklist');
            }).catch((error) => {
                if (error.code && error.code == "SQLITE_CONSTRAINT") {
                    CommonService.showToast('error', 'That Wallet already imported');
                } else {
                    CommonService.showToast('error', 'error');
                }
                $scope.isLoading = false;
            });
        } else {
            $state.go('guest.create.step-3', { basicInfo: basicInfo });
            $mdDialog.hide();
        }
    }

    $transitions.onStart({ }, function(trans) {
        trans.promise.finally(()=>{
            $mdDialog.hide();
            $scope.isLoading = false;
        });
    });

    function importAndUnlockExistingWallet() {
        let defer = $q.defer();

        let promise = RPCService.makeCall('importAndUnlockExistingWallet', {
            keystoreFilePath: $rootScope.walletImportData.keystoreFilePath,
            publicKey: $rootScope.walletImportData.publicKey,
            privateKey: $rootScope.walletImportData.privateKey,
            password: $rootScope.walletImportData.password,
            initialIdAttributesValues: basicInfo
        });

        promise.then((data) => {
            $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);
            let initialPromises = [];
            initialPromises.push($rootScope.wallet.loadIdAttributes());
            initialPromises.push($rootScope.wallet.loadTokens());

            $q.all(initialPromises).then((resp) => {

                SqlLiteService.registerActionLog("Created Attribute: First Name", "Created");
                SqlLiteService.registerActionLog("Created Attribute: Last Name", "Created");
                if(basicInfo.middle_name){
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

        return defer.promise;
    }
};

module.exports = PasswordWarningDialogController;
