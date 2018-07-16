'use strict';
const { Logger } = require('common/logger');
const log = new Logger('NewERC20TokenInfoController');

function NewERC20TokenInfoController(
	$rootScope,
	$scope,
	$q,
	$timeout,
	$mdDialog,
	symbol,
	balance,
	title
) {
	'ngInject';

	log.debug('NewERC20TokenInfoController');
	$scope.reloadTokensPrimise = null;

	$scope.cancel = event => {
		$rootScope.$broadcast('token:added');
		$rootScope.$broadcast('piechart:reload');
		$mdDialog.cancel();
	};

	$scope.symbol = symbol;
	$scope.balance = balance;
	$scope.title = title;
}
NewERC20TokenInfoController.$inject = [
	'$rootScope',
	'$scope',
	'$q',
	'$timeout',
	'$mdDialog',
	'symbol',
	'balance',
	'title'
];
module.exports = NewERC20TokenInfoController;
