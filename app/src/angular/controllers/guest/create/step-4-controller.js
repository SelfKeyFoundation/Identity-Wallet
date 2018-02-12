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
        $state.go('guest.create.step-3', { basicInfo: $stateParams.basicInfo });
    }

    function createKeystore() {
        let promise = WalletService.createKeystoreFile($scope.input.password);
        promise.then((wallet) => {
            $rootScope.wallet = wallet;

            // reload store
            ConfigFileService.load().then((store) => {
                let walletData = store.wallets[wallet.getPublicKeyHex()];
                let idAttributesStore = walletData.data.idAttributes;

                /**
                 * ID Attribute Items
                 */
                let nameItem = new IdAttributeItem();
                nameItem.addValue($stateParams.basicInfo.firstName);
                nameItem.addValue($stateParams.basicInfo.lastName);
                nameItem.addValue($stateParams.basicInfo.middleName);

                let countryOfResidencyItem = new IdAttributeItem();
                countryOfResidencyItem.addValue($stateParams.basicInfo.countryOfResidency);

                let idDocumentItem = new IdAttributeItem();

                let idDocumentWithSelfieItem = new IdAttributeItem();
                idDocumentWithSelfieItem.info.selfie = true;

                /**
                 * ID Attributes
                 */
                let nameIdAttribute = new IdAttribute("name");
                nameIdAttribute.addItem(nameItem);

                let countryOfResidencyIdAttribute = new IdAttribute("country_of_residency");
                countryOfResidencyIdAttribute.addItem(countryOfResidencyItem);

                let idDocumentIdAttribute = new IdAttribute("id_document");
                idDocumentIdAttribute.addItem(idDocumentItem);

                let idSelfieIdAttribute = new IdAttribute("id_selfie");
                idSelfieIdAttribute.addItem(idDocumentWithSelfieItem);

                idAttributesStore["name"] = nameIdAttribute;
                idAttributesStore["country_of_residency"] = countryOfResidencyIdAttribute;
                idAttributesStore["id_document"] = idDocumentIdAttribute;
                idAttributesStore["id_selfie"] = idSelfieIdAttribute;

                /*
                SelfkeyService.getIdAttributeTypes(true).then((idAttributes) => {
                    console.log(idAttributes);
                    for(let key in idAttributes){
                        let idAttribute = new IdAttribute(key);
                        idAttributesStore[key] = idAttribute;
                    }
                }).finally(()=>{
                    let nameItem = new IdAttributeItem();
                    nameItem.addValue($stateParams.basicInfo.firstName);
                    nameItem.addValue($stateParams.basicInfo.lastName);
                    nameItem.addValue($stateParams.basicInfo.middleName);

                    let countryOfResidencyItem = new IdAttributeItem();
                    countryOfResidencyItem.addValue($stateParams.basicInfo.countryOfResidency);

                    let idDocumentItem = new IdAttributeItem();

                    let idDocumentWithSelfieItem = new IdAttributeItem();
                    idDocumentWithSelfieItem.info.selfie = true;

                    idAttributesStore["name"].addItem(nameItem);
                    idAttributesStore["country_of_residency"].addItem(countryOfResidencyItem);
                    idAttributesStore["id_document"].addItem(idDocumentItem);
                    idAttributesStore["id_selfie"].addItem(idDocumentWithSelfieItem);
                });
                */

                ConfigFileService.save().then(() => {
                    $state.go('guest.create.step-5')
                }).catch((error) => {
                    // TODO proper message
                    $log.error(error);
                    CommonService.showToast('error', 'Error');
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
