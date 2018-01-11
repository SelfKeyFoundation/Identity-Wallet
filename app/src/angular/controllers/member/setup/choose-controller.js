import IdAttributeType from '../../../classes/id-attribute-type';
import IdAttributeItem from '../../../classes/id-attribute-item';
import IdAttribute from '../../../classes/id-attribute';

function MemberSetupChooseController($rootScope, $scope, $log, ElectronService, ConfigFileService) {
    'ngInject'



    $scope.importIdentity = () => {

        let promise = ElectronService.openFileSelectDialog();
        promise.then((file) => {

            let publicAddress = $rootScope.wallet.getPublicKeyHex();
            
            ElectronService.importKYCIdentity(file).then((resp) => {
                console.log(resp.public_key[0].value);
                if(publicAddress!=resp.public_key[0].value){
                    //handle address incorrect!
                }

                let store = ConfigFileService.getStore();
                let idAttributes = {};
                store.wallets[publicAddress] = {
                    data : {
                        idAttributes: idAttributes
                    }
                }
                
                for(let i in resp){
                    let idAttributeType = ConfigFileService.getIdAttributeType(i);
                    let idAttribute = new IdAttribute(i, idAttributeType);
                    resp[i].forEach((attr) => {
                        let idAttributeItem = new IdAttributeItem();
                        if(attr.isDoc){
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
                ConfigFileService.save().then((savedData)=>{
                    console.log(savedData)
                    //handle save store
                }).catch(() => {
                    //handle save store error
                })
                
                




            }).catch(() => {
                //handle import identity error
            })
        });
    }


};

export default MemberSetupChooseController;

