'use strict';

function SkDoubleHeaderDirective() {
	'ngInject';

	return {
		restrict: 'E',
		scope: {
			header: '@',
			subHeader: '@'
		},
		link: (scope, element) => {},
		replace: true,
		templateUrl: 'common/directives/sk-double-header.html'
	};
}
SkDoubleHeaderDirective.$inject = [];
module.exports = SkDoubleHeaderDirective;
