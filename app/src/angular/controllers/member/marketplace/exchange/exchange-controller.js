'use strict';

function MemberMarketplaceExchangeController($rootScope, $scope,$log, $state, $timeout, $mdDialog, $mdPanel, SqlLiteService, CommonService, RPCService) {
    'ngInject'
    //$scope.realData = statdata;
    console.log('dataaaaaaaaa', $state.params.data);
    $log.info('MemberMarketplaceExchangeController');
    // Initial 300 characters will be displayed.
    $scope.strLimit = 300;

    // String
    $scope.jobs = {
        description: "Hi. I have a list of items along with their information. The problem is I want to show the description up to 50 letters, but if it exceeds this value I want to show show more button upon clicking it I want to show the full text. I want to do it with filters, but I don't know one could achieve this with my way."
    };

    // Event trigger on click of the Show more button.
    $scope.showMore = function() {
        $scope.strLimit = $scope.jobs.description.length;
    };

    // Event trigger on click on the Show less button.
    $scope.showLess = function() {
        $scope.strLimit = 300;
    };





};

module.exports = MemberMarketplaceExchangeController;
