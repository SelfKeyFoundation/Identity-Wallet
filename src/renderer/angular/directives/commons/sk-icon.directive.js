'use strict';

function SkIconDirective($log) {
	'ngInject';

	return {
		restrict: 'E',
		scope: {
			icon: '@',
			sizeClass: '@',
			extension: '@'
		},
		link: (scope, element) => {
			scope.extension = scope.extension || 'svg';
		},
		replace: true,
		templateUrl: 'common/directives/sk-icon.html'
	};
}
SkIconDirective.$inject = ['$log'];
module.exports = SkIconDirective;
