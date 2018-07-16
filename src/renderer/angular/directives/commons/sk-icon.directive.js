'use strict';

function SkIconDirective() {
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
SkIconDirective.$inject = [];
module.exports = SkIconDirective;
