'use strict';
function SkCustomBoxDirective($rootScope, $log, $window, $timeout) {
	'ngInject';

	return {
		restrict: 'E',
		scope: {},
		link: (scope, element) => {
			scope.data = {
				name: 'Custom Tokens',
				text: 'Send or receive any custom ERC-20 token.'
			};
			scope.publicKeyHex = '0x' + $rootScope.wallet.getPublicKeyHex();
		},
		replace: true,
		templateUrl: 'common/directives/sk-custom-token-box.html'
	};
}
SkCustomBoxDirective.$inject = ['$rootScope', '$log', '$window', '$timeout'];
module.exports = SkCustomBoxDirective;
