function MemberMarketplaceIcoAcceptTermsController($rootScope, $scope, $log, $q, $timeout, $stateParams, $sce, ConfigFileService, CommonService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoAcceptTermsController', $stateParams);
    
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

};

export default MemberMarketplaceIcoAcceptTermsController;