'use strict';

function SkCloseWarningBoxDirective($rootScope, $log, $window, RPCService) {
	'ngInject';

	return {
		restrict: 'E',
		scope: {},
		link: (scope, element) => {
			element[0].style.display = 'none';

			RPCService.on('SHOW_CLOSE_DIALOG', event => {
				element[0].style.display = 'flex';
			});

			scope.yes = event => {
				$rootScope.closeApp();
			};

			scope.cancel = event => {
				element[0].style.display = 'none';
				RPCService.makeCustomCall('ON_CLOSE_DIALOG_CANCELED');
			};
		},
		replace: true,
		templateUrl: 'common/directives/sk-close-warning-box.html'
	};
}
SkCloseWarningBoxDirective.$inject = ['$rootScope', '$log', '$window', 'RPCService'];
module.exports = SkCloseWarningBoxDirective;
