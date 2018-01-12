import IdAttributeType from '../../../classes/id-attribute-type';
import IdAttributeItem from '../../../classes/id-attribute-item';
import IdAttribute from '../../../classes/id-attribute';

function MemberSetupChooseController($rootScope, $scope, $log, $state, Web3Service, ElectronService, ConfigFileService) {
    'ngInject'

    $scope.error = null;

    let store = ConfigFileService.getStore();

    checkStatus ();

    $scope.importIdentity = (event) => {
        $scope.error = null;

        let promise = ElectronService.openFileSelectDialog();
        promise.then((file) => {
            let publicAddress = "0x" + $rootScope.wallet.getPublicKeyHex();

            ElectronService.importKYCIdentity(file).then((resp) => {

                publicAddress = Web3Service.constructor.web3.utils.toChecksumAddress(publicAddress);

                if (publicAddress != resp.public_key[0].value) {
                    return $scope.error = 'Incorrect ETH Address'
                }

                let idAttributes = {};

                store.wallets[$rootScope.wallet.getPublicKeyHex()] = {
                    data: {
                        idAttributes: idAttributes
                    }
                }

                for (let i in resp) {
                    let idAttributeType = ConfigFileService.getIdAttributeType(i);
                    let idAttribute = new IdAttribute(i, idAttributeType);
                    resp[i].forEach((attr) => {
                        let idAttributeItem = new IdAttributeItem();
                        if (attr.isDoc) {
                            idAttributeItem.setAddition(attr.addition);
                            idAttributeItem.name = attr.name
                            idAttributeItem.contentType = attr.contentType;
                        }
                        idAttributeItem.setType(idAttributeType);
                        idAttributeItem.value = attr.value;
                        idAttribute.addItem(idAttributeItem);
                    });

                    idAttributes[i] = idAttribute;
                }

                ConfigFileService.save().then((savedData) => {
                    goToNextStep();
                }).catch(() => {
                    $scope.error = "Store cannot be saved";
                });
            }).catch(() => {
                $scope.error = "Error during import KYC";
            })
        });
    }

    /**
     * 
     */
    function checkStatus () {
        /**
         * 
         */
        let walletStore = store.wallets[$rootScope.wallet.getPublicKeyHex()];

        if (walletStore.data && walletStore.data.idAttributes && Object.keys(walletStore.data.idAttributes).length > 0) {
            goToNextStep();
        } 
    }

    function goToNextStep() {
        if (store.setup.icoAdsShown) {
            $state.go('member.dashboard.main');
        } else {
            $state.go('member.setup.completed');
        }
    }

};

export default MemberSetupChooseController;

