function MemberMarketplaceIcoItemController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, $sce, ConfigFileService, CommonService, SelfkeyService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoItemController', $stateParams);
    
    /**
     * 
     */
    $scope.view = {
        showKycRequirements: false,
        showActionButton: false
    }

    /**
     * get ico data
     */
    $scope.ico = $stateParams.selected;

    $scope.kycInfo = {
        organisation: "5a3f53da59cfda9e4639ba71", //$scope.ico.kyc.organisation,
        template: "507f1f77bcf86cd799439013" //$scope.ico.kyc.template
    }

    $scope.kycRequirementsCallbacks = {
        onReady: (error, requirementsList, progress) => {
            console.log("onReady", error, requirementsList, progress);


        }
    }

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

    $scope.trustSrc = (src) => {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.getActionButtonInfo = () => {
        // //complete-button, join-button, join-ico-button
        switch ($scope.info.status) {
            case $scope.infoStatuses.UNKNOWN:
                break;
            case $scope.infoStatuses.MISSING_REQUIREMENTS:
                return { clazz: 'complete-button', title: 'Complete Selfkey ID' };
                break;
            case $scope.infoStatuses.READY_TO_JOIN:
                return { clazz: 'join-button', title: 'Join Ico' };
                break;
            default:
        }
    }

    $scope.action = ($event) => {
        // TODO
        if($scope.info.status === $scope.infoStatuses.READY_TO_JOIN){
            $state.go('member.marketplace.ico-accept-terms', {selected: $scope.ico});
        }else{
            $state.go('member.marketplace.ico-manage-requirements', {selected: $scope.ico});
        }
    }

    // Token Details View 
    // 1: Join Ico (if all requirements are ok)
    // 2: Complete Selfkey ID (if missing any requirements)
    // 3: Join Ico (after all documents get ready & submited)
    
    // 4: show missing documents - (Screen 35)
    // 5: show message after all document get ready - (Screen 36)
    // 6: after click (3: Join Token Sale) -> Screen 38
    // 7: screen 40

    /**
     * 
     */
    function checkRequirementsProgress (progress) {
        let status = true;

        for(let i in progress) {
            let req = progress[i];
            if(!req || (!req.value && !req.path)){
                status = false;
                break;
            }
        }

        $scope.info.status = status ? $scope.infoStatuses.READY_TO_JOIN : $scope.infoStatuses.MISSING_REQUIREMENTS;
    }

};

export default MemberMarketplaceIcoItemController;