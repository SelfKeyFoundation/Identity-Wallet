'use strict';

function SkSelectIfDirective() {
	'ngInject';

	return {
		restrict: 'A',
		link: (scope, element, attr) => {
			attr.$observe('skSelectIf', value => {
				let b = scope.$eval(value);
				if (b) {
					element.addClass('selected');
				} else {
					element.removeClass('selected');
				}
			});
		}
	};
}
SkSelectIfDirective.$inject = [];
module.exports = SkSelectIfDirective;
