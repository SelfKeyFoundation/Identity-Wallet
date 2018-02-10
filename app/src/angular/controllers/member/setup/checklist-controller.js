const IdAttributeType = requireAppModule('angular/classes/id-attribute-type');
const IdAttributeItem = requireAppModule('angular/classes/id-attribute-item');
const IdAttribute = requireAppModule('angular/classes/id-attribute');
const EthUtils = requireAppModule('angular/classes/eth-utils');

function MemberSetupChecklistController($rootScope, $scope, $log, $state, Web3Service, ElectronService, ConfigFileService, SelfkeyService) {
    'ngInject'

    $scope.error = null;

    let store = ConfigFileService.getStore();

    $scope.nextStep = (event) => {
        $state.go('member.setup.add-document', {type: 'id_document'});
    }


    //checkStatus();

    $scope.importIdentity = (event) => {
        $scope.error = null;

        let promise = ElectronService.openFileSelectDialog({
            filters: [
                { name: 'zip package', extensions: ['zip'] }
            ]
        });
        promise.then((file) => {
            if (!file) {
                return;
            }
            let publicAddress = "0x" + $rootScope.wallet.getPublicKeyHex();
            let idAttributes = {};

            ElectronService.importKYCIdentity(file).then((resp) => {
                publicAddress = Web3Service.constructor.web3.utils.toChecksumAddress(publicAddress);
                
                if (publicAddress != resp.public_key[0].value) {
                    return $scope.error = 'kyc_import'
                }

                if(!store.wallets[$rootScope.wallet.getPublicKeyHex()]){
                    store.wallets[$rootScope.wallet.getPublicKeyHex()] = {};
                }

                store.wallets[$rootScope.wallet.getPublicKeyHex()].data = {
                    idAttributes: idAttributes
                }

                for (let i in resp) {
                    if(!resp.hasOwnProperty(i)) continue;

                    // TODO - check >> i << if it is known id attribute type
                    //let idAttributeType = ConfigFileService.getIdAttributeType(i);

                    let idAttribute = new IdAttribute(i);

                    resp[i].forEach((attr) => {
                        
                        let item = {};

                        if (attr.isDoc) {
                            item.values = [{
                                name: attr.name,
                                contentType: attr.contentType,
                                size: attr.size,
                                path: attr.value
                            }];
                            item.fileInfo = {
                                ifEidIsSkipped: attr.addition.ifEidIsSkipped,
                                optional: attr.addition.optional,
                                selfie: attr.addition.selfie,
                                signature: attr.addition.signature,
                            };
                        }else{
                            item.values = [attr.value]
                        }
                        
                        let idAttributeItem = new IdAttributeItem(item);
                        idAttribute.addItem(idAttributeItem);
                    });

                    idAttributes[i] = idAttribute;
                }

                let sessionPromise = SelfkeyService.retrieveKycSessionToken(
                    $rootScope.wallet.privateKeyHex,
                    EthUtils.toChecksumAddress($rootScope.wallet.publicKeyHex),
                    idAttributes["email"].items[idAttributes["email"].defaultItemId].values[0],     // TODO check email
                    "5a50a2a87e4de3001ea161d2"                                                      // TODO Take from config
                );
                sessionPromise.then((token) => {
                    if(!store.wallets.sessionsStore){
                        store.wallets.sessionsStore = {}
                        store.wallets.sessionsStore["5a50a2a87e4de3001ea161d2"] = token;
                    }
                    
                    ConfigFileService.save().then((savedData) => {
                        goToNextStep();                 
                    }).catch(() => {
                        $scope.error = "store_save";
                    });
                }).catch((error)=>{
                    $scope.error = "kyc_auth_error";
                });
            }).catch(() => {
                $scope.error = "kyc_import";
            })
        });
    };

    /**
     * 
     */
    function checkStatus() {
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

module.exports = MemberSetupChecklistController;