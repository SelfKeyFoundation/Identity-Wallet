function MemberMarketplaceIcoManageRequirementsController($rootScope, $scope, $log, $q, $timeout, $stateParams, $sce, ConfigFileService, CommonService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoManageRequirementsController', $stateParams);
    

    /**
     * get ico data
     */
    $scope.ico = $stateParams.selected;

    $scope.infoStatuses = {
        UNKNOWN: 'unknown',
        MISSING_REQUIREMENTS: 'missing-requirements',
        READY_TO_JOIN: 'ready-to-join'
    }

    /**
     * 
     */
    $scope.info = {
        status: $scope.infoStatuses.UNKNOWN, // 'missing-requirements' | 'ready-to-join' | ''
    }

    /**
     * prepare requirements - check them against local documents
     */
    checkRequirementsProgress ();

    /**
     * prepare chunks - requirement (columns)
     */
    $scope.sections = CommonService.chunkArray($scope.ico.kyc.requirements, 3);

    /**
     * 
     */
    function checkRequirementsProgress () {
        $scope.requirementsProgress = $scope.ico.checkRequirements(ConfigFileService);
        $log.info("Requirements Progress", $scope.requirementsProgress);
        
        let status = true;

        for(let i in $scope.requirementsProgress) {
            console.log(i, $scope.requirementsProgress[i])
            let req = $scope.requirementsProgress[i];
            if(!req || (!req.value && !req.path)){
                status = false;
                break;
            }
        }

        $scope.info.status = status ? $scope.infoStatuses.READY_TO_JOIN : $scope.infoStatuses.MISSING_REQUIREMENTS;
    }



    let now = new Date().getTime();
    // 1) find all missing idAttributeItems
    // 2) orginise directive
    // 3) todo ... ???

    $scope.testData1 = {
        title: "email",         // here must be idAttributeItem.key
        subtitle: "You can upload documents which at least contain your personal number, first name, last name, birth date and photo",
        type: 'static_data',    // | 'static_data',
        showAddItemButton: false,
        showHistory: false,
        isItemEditable: true,
        idAttributeItems: {
            email: {
                key: "email",
                type: "static_data",
                category: "global_attribute",
                defaultItemId: "1",
                entity: [
                    "individual",
                    "company"
                ],
                items: {
                    "1": {
                        "_id": "1",
                        "name": "",
                        "value": "",
                    }
                },
                actionHistory: [
                    
                ]
            }
        }
    }

    $scope.testData2 = {
        title: "passport", // here must be idAttributeItem.key
        subtitle: "You can upload documents which at least contain your personal number, first name, last name, birth date and photo",
        type: 'document',// | 'static_data',
        showAddItemButton: false,
        showHistory: false,
        isItemEditable: true,
        idAttributeItems: {
            passport: {
                key: "passport",
                type: "document",
                category: "id_document",
                defaultItemId: "1",
                entity: [
                    "individual",
                    "company"
                ],
                items: {
                    "1": {
                        "_id": "1",
                        "contentType": "",
                        "name": "",
                        "value": "",
                        "size": ""
                    }
                },
                actionHistory: [
                    {
                        date: new Date(now - 10000000),
                        status: 1,
                        note: "shared with bitDegree testing long text"
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain"
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain"
                    }
                ]
            }
        }
    }

    
    

};

export default MemberMarketplaceIcoManageRequirementsController;