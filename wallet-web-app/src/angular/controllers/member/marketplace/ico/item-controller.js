function MemberMarketplaceIcoItemController($rootScope, $scope, $log, $q, $timeout, $stateParams, ConfigFileService, CommonService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoItemController', $stateParams);
    
    /**
     * get ico data
     */
    $scope.ico = $stateParams.selected;

    // Token Details View 
    // 1: Join Ico (if all requirements are ok)
    // 2: Complete Selfkey ID (if missing any requirements)
    // 3: Join Token Sale (after all documents get ready & submited)
    
    // 4: show missing documents - (Screen 35)
    // 5: show message after all document get ready - (Screen 36)
    // 6: after click (3: Join Token Sale) -> Screen 38
    // 7: screen 40


    /**
     * prepare requirements - check them against local documents
     */
    $scope.requirementsProgress = {};
    for(let i in $scope.ico.kyc.requirements){
        let req = $scope.ico.kyc.requirements[i];
        $scope.requirementsProgress[$scope.ico.kyc.requirements[i]] = false;
    }

    console.log("????", $scope.requirementsProgress);

    /**
     * prepare chunks - requirement (columns)
     */
    $scope.sections = CommonService.chunkArray($scope.ico.kyc.requirements, 3);


};

export default MemberMarketplaceIcoItemController;