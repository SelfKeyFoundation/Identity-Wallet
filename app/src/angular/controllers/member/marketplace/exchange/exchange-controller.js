'use strict';

function MemberMarketplaceExchangeController($rootScope, $scope,$log,$filter, $state,$sce, $timeout, $mdDialog, $mdPanel, SqlLiteService, CommonService, RPCService) {
    'ngInject'
    $scope.realData = $state.params.data;
    console.log('gio', $state.params);
    $log.info('MemberMarketplaceExchangeController');
    // Initial 300 characters will be displayed.
    $scope.strLimit = 300;
    $scope.test = function () {
        $scope.realData.gio = $filter('limitTo')($scope.realData.description, $scope.strLimit, 0);
        $scope.realData.gio = $sce.trustAsHtml($scope.realData.gio);
    }
    $scope.test();

    // String


    // Event trigger on click of the Show more button.
    $scope.showMore = function() {
        $scope.strLimit = $scope.realData.description.length;
        $scope.test();
    };

    // Event trigger on click on the Show less button.
    $scope.showLess = function() {
        $scope.strLimit = 300;
        $scope.test();
    };





};

module.exports = MemberMarketplaceExchangeController;
