'use strict';
const { Logger } = require('common/logger');
const log = new Logger('GuestLoadingController');
function GuestLoadingController(
	$rootScope,
	$scope,
	$timeout,
	$state,
	$stateParams,
	$interval,
	EVENTS,
	SqlLiteService
) {
	'ngInject';

	log.info('GuestLoadingController');

	$scope.header = 'Loading';
	$scope.subHeader = '';
	let tokenPriceUpdaterInterval = null;

	init();

	function init() {
		if ($stateParams.redirectTo) {
			if ($stateParams.redirectTo === 'guest.create.step-5') {
				$scope.header = 'Wallet Setup Complete';
				$timeout(() => {
					goTo('member.dashboard.main');
				}, 2000);
			}
		}
	}

	function loadSqlLiteData() {
		$rootScope.loadingPromise = SqlLiteService.loadData();
		$rootScope.loadingPromise
			.then(() => {
				startTokenPriceUpdaterListener();
				goTo('guest.welcome');
			})
			.catch(error => {
				log.error(error);
			});
	}

	$rootScope.$on('$destroy', () => {
		stopTokenPriceUpdaterListener();
	});

	function startTokenPriceUpdaterListener() {
		tokenPriceUpdaterInterval = $interval(() => {
			SqlLiteService.loadTokenPrices();
		}, 10000);
	}

	function stopTokenPriceUpdaterListener() {
		$interval.cancel(tokenPriceUpdaterInterval);
	}

	function goTo(state) {
		$state.go(state);
		$rootScope.checkTermsAndConditions();
	}

	$rootScope.$on('APP_SUCCESS_LOADING', () => {
		loadSqlLiteData();
	});
}
GuestLoadingController.$inject = [
	'$rootScope',
	'$scope',
	'$timeout',
	'$state',
	'$stateParams',
	'$interval',
	'EVENTS',
	'SqlLiteService'
];
module.exports = GuestLoadingController;
