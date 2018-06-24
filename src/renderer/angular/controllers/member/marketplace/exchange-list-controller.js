'use strict';

function MemberMarketplaceExchangeListController(
	$rootScope,
	$scope,
	$log,
	$timeout,
	$mdDialog,
	$mdPanel,
	SqlLiteService,
	$sce,
	$filter
) {
	'ngInject';

	$log.info('MemberMarketplaceMainController', SqlLiteService.getExchangeData());

	SqlLiteService.loadExchangeData().then(() => {
		$scope.exchangesList = SqlLiteService.getExchangeData();

		angular.forEach($scope.exchangesList, item => {
			if (item.data && item.data.description) {
				item.content = $filter('limitTo')(item.data.description, 150, 0);
				item.content = $sce.trustAsHtml(item.content);
			}
		});
	});
}
MemberMarketplaceExchangeListController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$timeout',
	'$mdDialog',
	'$mdPanel',
	'SqlLiteService',
	'$sce',
	'$filter'
];
module.exports = MemberMarketplaceExchangeListController;
