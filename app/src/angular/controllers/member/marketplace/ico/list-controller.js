
function MemberMarketplaceIcoListController($rootScope, $scope, $log, $q, $timeout, ConfigFileService) {
    'ngInject'

    $log.info('MemberMarketplaceIcoListController');
    
    $scope.icos = ConfigFileService.getIcos();

};

export default MemberMarketplaceIcoListController;