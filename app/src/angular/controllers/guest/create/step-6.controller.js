'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function GuestKeystoreCreateStep6Controller($rootScope, $scope, $log, $state, $mdDialog, $stateParams, $q, CommonService, RPCService, SqlLiteService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep6Controller');

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

        if ($stateParams.type === 'kyc_import') {
            let promise = fillMissingBasicIds();
            promise.then(() => {
                $state.go('member.setup.checklist');
            });

            /*
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
            */
        } else {

            let promise = createInitialIdAttributesAndActivateWallet();

            promise.then((data) => {
                $state.go('member.setup.checklist');
            }).catch((error) => {
                console.log(">>>>>>>", error);
            });
        }
    }

    function createInitialIdAttributesAndActivateWallet() {
        let defer = $q.defer();

        let promise = RPCService.makeCall('addInitialIdAttributesToWalletAndActivate', {
            walletId: $rootScope.wallet.id,
            initialIdAttributesValues: $scope.input
        });

        promise.then(() => {
            SqlLiteService.loadWallets().then(() => {
                let promises = [];
                promises.push($rootScope.wallet.loadIdAttributes());
                promises.push($rootScope.wallet.loadTokens());

                $q.all(promises).then((responses) => {
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
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    function loadIdAttributes () {
        let idAttributes = $rootScope.wallet.getIdAttributes();

        for(let i in $scope.input){
            $scope.input[i] = getIdAttribute(idAttributes, i);
        }
    }

    function getIdAttribute (idAttributes, type) {
        if(idAttributes[type] && idAttributes[type].items && idAttributes[type].items.length && idAttributes[type].items[0].values && idAttributes[type].items[0].values.length){
            if(idAttributes[type].items[0].values[0].staticData.line1){
                return idAttributes[type].items[0].values[0].staticData.line1
            } else if (idAttributes[type].items[0].values[0].documentName) {
                idAttributes[type].items[0].values[0].documentName
            } else {
                return null;
            }
        }
    }

    loadIdAttributes ();

    // .......

    function fillMissingBasicIds () {
        let defer = $q.defer();

        let promise = RPCService.makeCall('fillMissingBasicIds', {
            walletId: $rootScope.wallet.id,
            initialIdAttributesValues: $scope.input
        });

        promise.then(() => {
            SqlLiteService.loadWallets().then(() => {
                let promises = [];
                promises.push($rootScope.wallet.loadIdAttributes());
                promises.push($rootScope.wallet.loadTokens());

                $q.all(promises).then((responses) => {
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
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }
};

module.exports = GuestKeystoreCreateStep6Controller;
