'use strict';

function SkLoadingDirective() {
	'ngInject';

	return {
		restrict: 'E',
		scope: {
			header: '=',
			subHeader: '='
		},
		link: (scope, element) => {},
		replace: true,
		templateUrl: 'common/directives/sk-loading.html'
	};
}
SkLoadingDirective.$inject = [];
module.exports = SkLoadingDirective;
