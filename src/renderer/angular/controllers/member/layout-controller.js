const { Logger } = require('common/logger/logger');
const log = new Logger('MemberLayoutController');
function MemberLayoutController(
	$rootScope,
	$scope,
	$mdDialog,
	$mdSidenav,
	$interval,
	$timeout,
	$state,
	Web3Service
) {
	'ngInject';

	$scope.showScrollStyle = false;

	var OSName = 'Unknown OS';
	if (navigator.appVersion.indexOf('Win') !== -1) OSName = 'Windows';
	if (navigator.appVersion.indexOf('Mac') !== -1) OSName = 'MacOS';
	if (navigator.appVersion.indexOf('Linux') !== -1) OSName = 'Linux';

	if (OSName === 'Windows') {
		$scope.showScrollStyle = true;
	}

	log.info('MemberLayoutController');

	/**
	 *
	 */
	$scope.openRightSidenav = () => {
		$mdSidenav('right')
			.toggle()
			.then(() => {
				log.info('toggle ' + 'right' + ' is done');
			});
	};

	/*
    $rootScope.goToSelfkeyIco = (event) => {
        let ico = null;
        let icos = ConfigFileService.getIcos();
        for (let i in icos) {
            for (let j in icos[i]) {
                if (['key', 'KEY'].indexOf(icos[i][j].symbol) !== -1) {
                    ico = icos[i][j];
                    break;
                }
            }
        }
        if (ico) {
            $state.go('member.marketplace.ico-item', { selected: ico });
        }
    }
    */
}
MemberLayoutController.$inject = [
	'$rootScope',
	'$scope',
	'$mdDialog',
	'$mdSidenav',
	'$interval',
	'$timeout',
	'$state',
	'Web3Service'
];
module.exports = MemberLayoutController;
