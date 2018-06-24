'use strict';

function SkOfflineWarningBoxDirective($rootScope, $log, $window, RPCService) {
	'ngInject';

	return {
		restrict: 'E',
		scope: {},
		link: (scope, element) => {
			element[0].style.display = 'none';

			RPCService.on('SHOW_IS_OFFLINE_WARNING', event => {
				element[0].style.display = 'flex';
			});

			scope.onOK = event => {
				RPCService.makeCustomCall('ON_IGNORE_CLOSE_DIALOG');
				$rootScope.closeApp();
			};
		},
		replace: true,
		templateUrl: 'common/directives/sk-offline-warning-box.html'
	};
}
SkOfflineWarningBoxDirective.$inject = ['$rootScope', '$log', '$window', 'RPCService'];
module.exports = SkOfflineWarningBoxDirective;
