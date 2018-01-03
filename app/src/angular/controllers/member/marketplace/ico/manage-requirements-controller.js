import IdAttributeItem from '../../../../classes/id-attribute-item.js';
import IdAttribute from '../../../../classes/id-attribute.js';

function MemberMarketplaceIcoManageRequirementsController($rootScope, $scope, $log, $q, $timeout, $stateParams, $sce, ConfigFileService, CommonService, SelfkeyService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoManageRequirementsController', $stateParams);

    let messagesContainer = angular.element(document.getElementById("message-container"));

    /**
     * get ico data
     */
    $scope.ico = $stateParams.selected;
    $scope.kycProgress = $stateParams.kycProgress;
    $scope.allIdAttributes = $stateParams.allIdAttributes;
    $scope.kycInfo = $stateParams.kycInfo;

    $scope.icoDetailsBoxConfig = {
        showSubmit: false
    }

    $scope.foundUnknownRequirement = false;

    $scope.idAttrbuteBoxConfig = {
        historyRowCount: 2,
        showAddItemButton: false,
        showHistory: false,
        isItemEditable: true,

        callback: {
            itemChanged: (data) => { }
        }
    };

    $scope.missingRequirementsList = [];

    buildMissingRequirementsList();

    function buildMissingRequirementsList() {
        for (let i in $scope.allIdAttributes) {
            let req = $scope.allIdAttributes[i];
            $scope.missingRequirementsList.push(req);
        }
    }

    $rootScope.$on('ico:requirements-ready', () => {
        CommonService.showMessage({
            container: messagesContainer,
            type: "info",
            message: "Success! All Documents are ready - Join ICO",
            replace: true,
            closeAfter: 3000
        });

        $scope.icoDetailsBoxConfig.showSubmit = true;
    });

    $rootScope.$on('id-attributes-changed', (event, data) => {
        console.log('id-attributes-changed', data);
    });

    $rootScope.$on('kyc:requirements-updated', (event, requirementsList, missingRequirements, allIdAttributes) => {
        $scope.kycProgress = missingRequirements;
        $scope.allIdAttributes = allIdAttributes;

        if (Object.keys(missingRequirements).length <= 0) {
            $scope.icoDetailsBoxConfig.showSubmit = true;
        }else{
            $scope.icoDetailsBoxConfig.showSubmit = false;
            CommonService.showMessage({
                container: messagesContainer,
                type: "warning",
                message: "Missing required ID Attributes",
                replace: true,
                closeAfter: 3000
            });
        }

        $scope.missingRequirementsList = [];
        buildMissingRequirementsList();
    });

};

export default MemberMarketplaceIcoManageRequirementsController;