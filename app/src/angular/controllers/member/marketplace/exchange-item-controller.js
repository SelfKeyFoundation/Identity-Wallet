'use strict';

function MemberMarketplaceExchangeItemController($rootScope, $scope, $log, $filter, $state, $sce, $timeout, $mdDialog, $mdPanel, SqlLiteService, CommonService, RPCService) {
    'ngInject'
    $scope.realData = $state.params.data;
    $log.info('MemberMarketplaceExchangeItemController');
    // Initial 300 characters will be displayed.
    $scope.strLimit = 300;
    $scope.toggle = function () {
        $scope.realData.text = $filter('limitTo')($scope.realData.description, $scope.strLimit, 0);
        $scope.realData.text = $sce.trustAsHtml($scope.realData.text);
    };
    $scope.toggle();


    // Event trigger on click of the Show more button.
    $scope.showMore = function () {
        $scope.strLimit = $scope.realData.description.length;
        $scope.toggle();
    };

    // Event trigger on click on the Show less button.
    $scope.showLess = function () {
        $scope.strLimit = 300;
        $scope.toggle();
    };

    $scope.isInKycFields = function (item) {
        return ($scope.realData ? $scope.realData['KYC Field'] || [] : []).indexOf(item) > -1;
    }
};

module.exports = MemberMarketplaceExchangeItemController;
