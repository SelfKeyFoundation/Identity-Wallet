function MemberIdWalletMainController($rootScope, $scope, $log, ConfigFileService) {
    'ngInject'

    $log.info('MemberIdWalletMainController');

    $scope.idAttributesList = ConfigFileService.getIdAttributesStore();

    $scope.idAttrbuteConfig = {

    }

    /**
     * 1: load IdAttributesType List
     * 2: load user's IdAttribute List
     * 3: render user's IdAttribute List
     */




};

module.exports = MemberIdWalletMainController;
