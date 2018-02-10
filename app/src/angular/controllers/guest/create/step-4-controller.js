const IdAttribute = requireAppModule('angular/classes/id-attribute');
const IdAttributeItem = requireAppModule('angular/classes/id-attribute-item');

function GuestKeystoreCreateStep4Controller($rootScope, $scope, $log, $q, $timeout, $state, $window, $stateParams, WalletService, ConfigFileService, CommonService) {
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
        $state.go('guest.create.step-3', {basicInfo: $stateParams.basicInfo});
    }

    function createKeystore() {
        let promise = WalletService.createKeystoreFile($scope.input.password);
        promise.then((wallet) => {
            $rootScope.wallet = wallet;

            // reload store
            ConfigFileService.load().then((store) => {
                console.log("store", store);

                // TODO - save basic info
                // firstName
                // lastName
                // middleName
                // countryOfResidency

                let walletData = store.wallets[wallet.getPublicKeyHex()];
                let idAttributesStore = walletData.data.idAttributes;

                let nameItem = new IdAttributeItem();
                nameItem.addValue($stateParams.basicInfo.firstName);
                nameItem.addValue($stateParams.basicInfo.lastName);
                nameItem.addValue($stateParams.basicInfo.middleName);

                let countryOfResidencyItem = new IdAttributeItem();
                countryOfResidencyItem.addValue($stateParams.basicInfo.countryOfResidency);

                let nameIdAttribute = new IdAttribute("name");
                nameIdAttribute.addItem(nameItem);

                let countryOfResidencyIdAttribute = new IdAttribute("country_of_residency");
                countryOfResidencyIdAttribute.addItem(countryOfResidencyItem);

                idAttributesStore["name"] = nameIdAttribute;
                idAttributesStore["country_of_residency"] = countryOfResidencyIdAttribute;

                console.log(">>>>>>", idAttributesStore);

                ConfigFileService.save().then(() => {
                    // TODO
                    // got to next step
                    $state.go('guest.create.step-5')
                }).catch(() => {
                    // TODO handle
                });
            });
        }).catch((error) => {
            $log.error(error);
        });
    }
};

module.exports = GuestKeystoreCreateStep4Controller;