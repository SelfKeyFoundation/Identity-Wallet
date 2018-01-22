import IdAttributeType from '../../../classes/id-attribute-type';
import IdAttributeItem from '../../../classes/id-attribute-item';
import IdAttribute from '../../../classes/id-attribute';

function MemberSetupChooseController($rootScope, $scope, $log, $state, Web3Service, ElectronService, ConfigFileService, SelfkeyService) {
    'ngInject'

    $scope.error = null;

    let store = ConfigFileService.getStore();

    checkStatus();

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

                store.wallets[$rootScope.wallet.getPublicKeyHex()] = {
                    data: {
                        idAttributes: idAttributes
                    }
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

                ConfigFileService.save().then((savedData) => {
                    goToNextStep();
                    
                    /*
                    let sessionPromise = SelfkeyService.retrieveKycSessionToken(
                        $rootScope.wallet.privateKeyHex,
                        $rootScope.wallet.publicKeyHex,
                        idAttributes["email"].items[idAttributes["email"].defaultItemId].values[0],     // TODO check email
                        "5a50a2a87e4de3001ea161d2"                                                      // TODO Take from config
                    );
                    sessionPromise.then((resp) => {
                        console.log(">>>>>resp>>>>>>>>", resp);
                    }).catch((error)=>{
                        console.log(">>>>error>>>>>>>>>", error);
                    });
                    */
                    
                    /*
                    SelfkeyService.authWithKYC($rootScope.wallet.privateKeyHex, $rootScope.wallet.privateKeyHex.publicKeyHex, "5a50a2a87e4de3001ea161d2").then((resp)=>{
                        console.log(">>>>", resp, "<<<<<<")
                        //goToNextStep();
                    }).catch((error)=>{
                        console.log(">>>>>>>>", error);
                    })
                    */                    
                }).catch(() => {
                    $scope.error = "store_save";
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

export default MemberSetupChooseController;