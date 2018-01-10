function MemberMarketplaceIcoAcceptTermsController($rootScope, $scope, $log, $q, $timeout, $stateParams, $sce, ConfigFileService, CommonService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoAcceptTermsController', $stateParams);
    
    /**
     * get ico data
     */
    $scope.ico = $stateParams.selected;

    $scope.terms = {
        "1": false,
        "2": false,
        "3": false,
    }

    $scope.sendEth = (event) => {
        $log.info($scope.terms, "sendEth");
    }

};

export default MemberMarketplaceIcoAcceptTermsController;