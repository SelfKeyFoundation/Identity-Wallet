'use strict';
function SkCustomBoxDirective($rootScope, $window, $timeout) {
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

			scope.navigateToTransfer = event => {
				// $rootScope.openSendTokenDialog(event, null, true);
				$rootScope.openSendTransactionDialog(event, null, true);
			};
		},
		replace: true,
		templateUrl: 'common/directives/sk-custom-token-box.html'
	};
}
SkCustomBoxDirective.$inject = ['$rootScope', '$window', '$timeout'];
module.exports = SkCustomBoxDirective;
