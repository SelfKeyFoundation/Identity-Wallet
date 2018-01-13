function MemberMarketplaceIcoItemController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, $sce, ConfigFileService, CommonService, SelfkeyService, $window, ElectronService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoItemController', $stateParams);

    let store = ConfigFileService.getStore();

    $scope.trustSrc = (src) => {
        return $sce.trustAsResourceUrl(src);
    }

    /**
     * get ico data
     */
    $scope.ico = $stateParams.selected;

    normaliseIcoData();

    $scope.kycInfo = {
        apiEndpoint: $scope.ico.kyc.apiEndpoint,
        organisation: $scope.ico.kyc.organisation,
        template: $scope.ico.kyc.template
    }


    $scope.gotToTokenSale = ($event) => {
        $state.go('member.marketplace.ico-accept-terms', {selected: $scope.ico});
    }

    /**
     *
     */
    function normaliseIcoData() {
        if (typeof $scope.ico.token.totalOnSale === 'number') {
            $scope.ico.tokenSalePercent = (($scope.ico.token.totalOnSale / $scope.ico.token.total) * 100).toFixed(2);
        }
        if ($scope.ico.cap.total && $scope.ico.cap.raised) {
            $scope.ico.cap.capPercent = (($scope.ico.cap.raised / $scope.ico.cap.total) * 100).toFixed(2);
        }
    }

};

export default MemberMarketplaceIcoItemController;