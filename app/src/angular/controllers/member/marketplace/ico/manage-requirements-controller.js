import IdAttributeItem  from '../../../../classes/id-attribute-item.js';
import IdAttribute      from '../../../../classes/id-attribute.js';

function MemberMarketplaceIcoManageRequirementsController($rootScope, $scope, $log, $q, $timeout, $stateParams, $sce, ConfigFileService, CommonService, SelfkeyService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoManageRequirementsController', $stateParams);

    let messagesContainer = angular.element(document.getElementById("message-container"));

    /**
     * get ico data
     */
    $scope.ico = $stateParams.selected;
    $scope.kycProgress = $stateParams.kycProgress;
    $scope.kycInfo = $stateParams.kycInfo;

    $scope.foundUnknownRequirement = false;

    $scope.idAttrbuteBoxConfig = { 
        historyRowCount: 2,  
        showAddItemButton: false,
        showHistory: false,
        isItemEditable: true,

        callback: {
            itemChanged: (data) => {}
        }
    };

    $scope.missingRequirementsList = [];

    buildMissingRequirementsList ();

    function buildMissingRequirementsList () {
        let store = ConfigFileService.getStore();

        console.log(">>>>>>>>>> kycProgress >>>>>>>>", $scope.kycProgress);


        for(let i in $scope.kycProgress){
            let req = $scope.kycProgress[i];

            if(req) continue;

            let idAttribute = store.idAttributes[i];
            if(!idAttribute){
                let idAttributeType = ConfigFileService.getIdAttributeType(i);
                
                if(!idAttributeType){
                    $scope.foundUnknownRequirement = true;
                    continue;
                }

                let idAttributeItem = new IdAttributeItem();
                idAttributeItem.setType(idAttributeType);
                idAttributeItem.name = i;

                idAttribute = new IdAttribute(i, idAttributeType);
                idAttribute.setDefaultItem(idAttributeItem)
            }

            $scope.missingRequirementsList.push(idAttribute);
        }
    }

    $rootScope.$on('ico:requirements-ready', () => {
        CommonService.showMessage({
            container: messagesContainer,
            type: "info",
            message: "Success! All Documents are ready - Join ICO",
            closeAfter: 3000
        });
    });

};

export default MemberMarketplaceIcoManageRequirementsController;