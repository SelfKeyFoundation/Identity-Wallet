'use strict';

function MemberMarketplaceExchangeListController($rootScope, $scope, $log, $timeout, $mdDialog, $mdPanel, SqlLiteService, $sce, $filter) {
    'ngInject'

    $log.info('MemberMarketplaceMainController');

    $scope.exchangesList = SqlLiteService.getExchangeData();

    angular.forEach($scope.exchangesList, (item) => {
        if (item.data && item.data.description) {
            item.content = $filter('limitTo')(item.data.description, 300, 0);
            item.content = $sce.trustAsHtml(item.content);
        }
    });
};

module.exports = MemberMarketplaceExchangeListController;
