/* global angular */
const { Logger } = require('common/logger/logger');
const log = new Logger('MemberRightSidenavController');
function MemberRightSidenavController($rootScope, $scope, $mdSidenav, $state, $mdDialog) {
	'ngInject';

	log.info('RightSidenavController');

	$scope.close = () => {
		$mdSidenav('right')
			.close()
			.then(() => {
				log.info('close LEFT is done');
			});
	};

	$scope.getSelectedClass = state => {
		if ($state.current.name.indexOf(state) !== -1) {
			return 'sk-right-sidenav__section__item__selected';
		}
	};

	$scope.navigateToCreateId = () => {
		if (angular.equals({}, $rootScope.wallet.getIdAttributes())) {
			$state.go('guest.create.step-5');
		} else {
			$state.go('member.id-wallet.main');
		}
		$scope.close();
	};

	$scope.navigateToCreateIdNew = () => {
		if (angular.equals({}, $rootScope.wallet.getIdAttributes())) {
			$state.go('guest.create.step-5');
		} else {
			$state.go('member.selfkey-id.main');
		}
		$scope.close();
	};

	$rootScope.navigate = ($event, state, params) => {
		$state.go(state, params);
		$scope.close();
	};
}
MemberRightSidenavController.$inject = [
	'$rootScope',
	'$scope',
	'$mdSidenav',
	'$state',
	'$mdDialog'
];
module.exports = MemberRightSidenavController;
