'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function GuestKeystoreCreateStep2Controller($rootScope, $scope, $log, $state, $mdDialog, $stateParams, $q, CommonService, RPCService, SqlLiteService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep2Controller');

    $scope.isLoading = false;
    $scope.countryList = SqlLiteService.getCountries();

    $scope.input = {
        first_name: "",
        last_name: "",
        middle_name: "",
        country_of_residency: ""
    };

    $scope.nextStep = (event, form) => {
        if (!form.$valid) return;

        if ($stateParams.type === 'import') {
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
            $state.go('guest.create.step-3', { basicInfo: $scope.input });
        }
    }

    function importAndUnlockExistingWallet() {
        let defer = $q.defer();

        let promise = RPCService.makeCall('importAndUnlockExistingWallet', {
            keystoreFilePath: $rootScope.walletImportData.keystoreFilePath,
            publicKey: $rootScope.walletImportData.publicKey,
            privateKey: $rootScope.walletImportData.privateKey,
            password: $rootScope.walletImportData.password,
            initialIdAttributesValues: $scope.input
        });

        promise.then((data) => {
            $rootScope.wallet = new Wallet(data.id, data.privateKey, data.publicKey, data.keystoreFilePath);
            let initialPromises = [];

            initialPromises.push($rootScope.wallet.loadIdAttributes());
            initialPromises.push($rootScope.wallet.loadTokens());

            $q.all(initialPromises).then((resp) => {
                SqlLiteService.registerActionLog("Created Attribute: First Name", "Created");
                SqlLiteService.registerActionLog("Created Attribute: Last Name", "Created");

                if ($scope.input.middle_name) {
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

module.exports = GuestKeystoreCreateStep2Controller;
